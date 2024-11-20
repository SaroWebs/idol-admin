<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\CustomerController;

class OrderController extends Controller
{


    public function get_orders_data(Request $request)
    {
        $query = Order::with(['orderItems.statuses', 'orderItems.product', 'customer', 'customerAddress']);
        if ($request->status == 'new') {
            $query->whereIn('status', ['pending', 'placed', 'approved']);
        } elseif ($request->status == 'processed') {
            $query->whereIn('status', ['processed', 'onway']);
        } elseif ($request->status == 'completed') {
            $query->whereIn('status', ['completed', 'delivered']);
        } elseif ($request->status == 'incomplete') {
            $query->whereIn('status', ['cancelled', 'returned']);
        } else {
            return response()->json(null);
        }

        $orders = $query->paginate();
        $statusCounts = [
            'new' => Order::whereIn('status', ['pending', 'placed', 'approved'])->count(),
            'processed' => Order::whereIn('status', ['processed', 'onway'])->count(),
            'completed' => Order::whereIn('status', ['completed', 'delivered'])->count(),
            'incomplete' => Order::whereIn('status', ['cancelled', 'returned'])->count(),
        ];

        // Format response to include counts
        return response()->json([
            'orders' => $orders,
            'counts' => $statusCounts
        ]);
    }

    public function cancelOrder(Order $order)
    {
        // Start database transaction
        DB::beginTransaction();

        try {
            // Get all order items
            $items = $order->orderItems;

            foreach ($items as $item) {
                $activeStatus = $item->statuses()->where('active', 1)->first();
                if ($activeStatus && !in_array($activeStatus->status, ['cancelled', 'returned'])) {
                    $activeStatus->update(['active' => 0]);

                    $item->statuses()->create([
                        'status' => 'cancelled',
                        'done_by' => 'admin',
                        'active' => 1,
                        'reason' => 'Order cancelled by admin'
                    ]);
                }
            }

            // Update the order status to 'cancelled'
            $order->payable_amount = 0;
            $order->status = 'cancelled';
            $order->save();

            // Commit transaction
            DB::commit();

            return response()->json(['message' => 'Order has been cancelled successfully.'], 200);
        } catch (\Exception $e) {
            // Rollback transaction in case of error
            DB::rollBack();

            return response()->json(['error' => 'Failed to cancel the order.'], 500);
        }
    }

    public function approveOrder(Order $order)
    {
        foreach ($order->orderItems as $item) {
            $activeStatus = $item->statuses()->where('active', 1)
                ->whereNotIn('status', ['cancelled', 'returned'])
                ->first();

            if ($activeStatus) {
                $item->statuses()->create([
                    'status' => 'approved',
                    'done_by' => 'admin',
                    'active' => 1
                ]);
                $activeStatus->update(['active' => 0]);
            }
        }

        $order->status = 'approved';
        $order->save();

        return response()->json([
            'message' => 'Order approved successfully.',
            'order' => $order->load('orderItems.statuses')
        ]);
    }

    public function processOrder(Order $order)
    {
        foreach ($order->orderItems as $item) {
            $activeStatus = $item->statuses()->where('active', 1)
                ->where('status', 'approved')
                ->first();

            if ($activeStatus) {
                $item->statuses()->create([
                    'status' => 'processed',
                    'done_by' => 'admin',
                    'active' => 1
                ]);

                $activeStatus->update(['active' => 0]);
            }
        }

        $order->status = 'processed';
        $order->save();

        return response()->json([
            'message' => 'Order processed successfully.',
            'order' => $order->load('orderItems.statuses')
        ]);
    }

    
    public function deliverOrder(Order $order)
    {
        foreach ($order->orderItems as $item) {
            $activeStatus = $item->statuses()->where('active', 1)
                ->where('status', 'processed')
                ->first();

            if ($activeStatus) {
                $item->statuses()->create([
                    'status' => 'delivered',
                    'done_by' => 'delivery',
                    'active' => 1
                ]);

                $activeStatus->update(['active' => 0]);
            }
        }

        $order->status = 'delivered';
        $order->save();

        return response()->json([
            'message' => 'Order delivered successfully.',
            'order' => $order->load('orderItems.statuses')
        ]);
    }

    public function item_status(OrderItem $orderItem)
    {
        $activeStatus = $orderItem->statuses()->where('active', 1)
            ->first();

       if ($activeStatus) {
        return response()->json(['status'=> $activeStatus->status]);
       }
       return response()->json(['status'=> 'unknoun']);
    }

    // by customer request
    public function store(Request $request)
    {
        
        $validatedData = $request->validate([
            'order_no' => 'required|string',
            'customer_id' => 'required|exists:customers,id',
            'customer_address_id' => 'required|exists:customer_addresses,id',
            'payment_mode' => 'required|in:cash,online',
            'payment_amount' => 'required|numeric',
            'payment_status' => 'required|in:pending,paid,failed',
            'prescription_id' => 'nullable',
            'transaction_id' => 'nullable|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric',
        ]);

        // Create the order
        $order = Order::create([
            'order_no' => $validatedData['order_no'],
            'customer_id' => $validatedData['customer_id'],
            'customer_address_id' => $validatedData['customer_address_id'],
            'payment_mode' => $validatedData['payment_mode'],
            'payable_amount' => $validatedData['payment_amount'],
            'payment_status' => $validatedData['payment_status'],
            'transaction_id' => $validatedData['transaction_id'],
            'status' => 'placed'
        ]);

        if ($order) {
            $existingPrescription = Prescription::where('customer_id', $validatedData['customer_id'])
                ->where('status', 'pending')
                ->first();
            if($validatedData['prescription_id']){
                $existingPrescription = Prescription::where('id', $validatedData['prescription_id'])->first();
            }

            if ($existingPrescription) {
                $existingPrescription->status = 'assigned';
                $existingPrescription->order_id = $order->id;
                $existingPrescription->save();
            }
        }
        // Create order items
        foreach ($validatedData['products'] as $item) {
            $order->orderItems()->create($item);
        }

        // Create initial order statuses for each item
        foreach ($order->orderItems as $orderItem) {
            $orderItem->statuses()->create([
                'status' => 'placed',
                'done_by' => 'admin',
                'active' => true,
            ]);
        }

        return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
    }
    // by customer request
    public function place(Request $request)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        // Validate incoming request data
        $validatedData = $request->validate([
            'order_no' => 'required|string',
            'customer_address_id' => 'required|exists:customer_addresses,id',
            'payment_mode' => 'required|in:cash,online',
            'payable_amount' => 'required|numeric',
            'payment_status' => 'required|in:pending,paid,failed',
            'transaction_id' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        // Create the order
        $order = Order::create([
            'order_no' => $validatedData['order_no'],
            'customer_id' => $customer->id,
            'customer_address_id' => $validatedData['customer_address_id'],
            'payment_mode' => $validatedData['payment_mode'],
            'payable_amount' => $validatedData['payable_amount'],
            'payment_status' => $validatedData['payment_status'],
            'transaction_id' => $validatedData['transaction_id'],
            'status' => 'placed'
        ]);

        if ($order) {
            $existingPrescription = Prescription::where('customer_id', $customer->id)
                ->where('status', 'pending')
                ->first();

            if ($existingPrescription) {
                $existingPrescription->status = 'assigned';
                $existingPrescription->order_id = $order->id;
                $existingPrescription->save();
            }
        }
        // Create order items
        foreach ($validatedData['items'] as $item) {
            $order->orderItems()->create($item);
        }

        // Create initial order statuses for each item
        foreach ($order->orderItems as $orderItem) {
            $orderItem->statuses()->create([
                'status' => 'placed',
                'done_by' => 'customer',
                'active' => true,
            ]);
        }

        return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
    }

    // customer request
    public function get_orders(Request $request)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);

        $orders = Order::where('customer_id', $customer->id)
            ->with(['orderItems.product', 'orderItems.statuses'])
            ->orderBy('id', 'desc')
            ->get();

        foreach ($orders as $order) {
            $order->prescription = Prescription::where('order_id', $order->id)->first();
        }

        return response()->json($orders);
    }

    public function get_order(Request $request, Order $order)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if ($order && $order->customer_id == $customer->id) {
            $order->load(['orderItems.product.images', 'orderItems.statuses']);
            $order->prescription = Prescription::where('order_id', $order->id)->first();
            return response()->json($order);
        }
        return response()->json(['message' => 'Order not found !'], 404);
    }

    public function cancel_order(Request $request, Order $order)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if ($order && $order->customer_id == $customer->id) {
            $items = $order->orderItems;
            foreach ($items as $item) {
                OrderStatus::where('order_item_id', $item->id)
                    ->where('active', 1)
                    ->update(['active' => 0]);

                OrderStatus::create([
                    'order_item_id' => $item->id,
                    'status' => 'cancelled',
                    'reason' => $request->input('reason') ?? '',
                    'done_by' => 'customer',
                    'active' => 1,
                    'created_at' => now(),
                ]);
            }
            
            $order->payable_amount = 0;
            $order->status = 'cancelled';
            $order->save();
            return response()->json($order);
        }
        return response()->json(['message' => 'Order not found !'], 404);
    }
    
    public function cancel_order_item(Request $request, OrderItem $orderItem)
    {
        $messages = [];
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        
        $order = $orderItem->order;
        if($order){
            array_push($messages, "Got Order with id: ".$order->id);
        }
        $product = $orderItem->product;
        if($product){
            array_push($messages, "Got Product with id: ".$product->id);
        }
        $tax = $product->tax;
        if($tax){
            array_push($messages, "Got tax with rate: ".$tax->tax_rate);
            $tax_rate = $tax->tax_rate;
        }else{
            array_push($messages, "No tax");
            $tax_rate = 0;
        }

        if ($product && $order) {
            $product_price = $product->offer_price;
            $deductable = $product_price * (1 + ($tax_rate / 100));
            $payable = $order->payable_amount - $deductable;
            $order->update(['payable_amount' => max($payable, 0)]);
            $existingItems = OrderStatus::where('order_item_id', $orderItem->id)->where('active', 1)->get();
            foreach ($existingItems as $exi) {
                $exi->active = 0;
                $exi->save();
            }

            $status = new OrderStatus();
            $status->order_item_id = $orderItem->id;
            $status->status = 'cancelled';
            $status->reason = $request->input('reason') ?? '';
            $status->done_by = 'customer';
            $status->active = 1;
            $status->created_at = now();
            $status->save();
        }

        return response()->json(['message' => 'Item Cancelled !'], 200);
    }
    
    public function cancel_order_item_by_delivery(Request $request, OrderItem $orderItem)
    {
        $messages = [];
        $order = $orderItem->order;
        if($order){
            array_push($messages, "Got Order with id: ".$order->id);
        }
        $product = $orderItem->product;
        if($product){
            array_push($messages, "Got Product with id: ".$product->id);
        }
        $tax = $product->tax;
        if($tax){
            array_push($messages, "Got tax with rate: ".$tax->tax_rate);
            $tax_rate = $tax->tax_rate;
        }else{
            array_push($messages, "No tax");
            $tax_rate = 0;
        }

        if ($product && $order) {
            $product_price = $product->offer_price;
            $deductable = $product_price * (1 + ($tax_rate / 100));
            $payable = $order->payable_amount - $deductable;
            $order->update(['payable_amount' => max($payable, 0)]);
            $existingItems = OrderStatus::where('order_item_id', $orderItem->id)->where('active', 1)->get();
            foreach ($existingItems as $exi) {
                $exi->active = 0;
                $exi->save();
            }

            $status = new OrderStatus();
            $status->order_item_id = $orderItem->id;
            $status->status = 'cancelled';
            $status->reason = $request->input('reason') ?? '';
            $status->done_by = 'delivery';
            $status->active = 1;
            $status->created_at = now();
            $status->save();
        }

        return response()->json(['message' => 'Item Cancelled !'], 200);
    }
    
    public function return_order(Request $request, Order $order)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if ($order && $order->customer_id == $customer->id) {
            $items = $order->orderItems;

            foreach ($items as $item) {
                $existing = OrderStatus::where('order_item_id', $item->id)
                    ->where('active', 1)
                    ->where('status', '!=', 'cancelled')
                    ->first();
                if ($existing) {
                    $existing->update(['active' => 0]);
                    OrderStatus::create([
                        'order_item_id' => $item->id,
                        'status' => 'returned',
                        'reason' => $request->input('reason') ?? '',
                        'done_by' => 'customer',
                        'active' => 1,
                        'created_at' => now(),
                    ]);
                }
            }

            $order->status = 'returned';
            $order->save();
            return response()->json($order);
        }
        return response()->json(['message' => 'Order not found !'], 404);
    }
}
