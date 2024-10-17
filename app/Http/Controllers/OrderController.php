<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    //
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

    public function get_orders(Request $request)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);

        $orders = Order::where('customer_id', $customer->id)
            ->with(['orderItems.product', 'orderItems.statuses'])
            ->get();

        foreach ($orders as $order) {
            $order->prescription = Prescription::where('order_id', $order->id)->first();
        }

        return response()->json($orders); // Return orders as JSON response
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
        return response()->json(['message'=>'Order not found !'], 404);
    }
}
