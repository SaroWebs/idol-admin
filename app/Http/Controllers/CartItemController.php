<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Prescription;
use Illuminate\Http\Request;
use App\Models\CustomerLogin;
use Illuminate\Support\Facades\Storage;

class CartItemController extends Controller
{

    public function get_items(Request $request)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if ($customer) {
            $items = CartItem::where('customer_id', $customer->id)
                ->with(['product.images'])
                ->get();
            return response()->json($items);
        } else {
            return response()->json([], 400);
        }
    }

    public function add_item(Request $request, Product $product)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer; // This will return the error response if authentication failed
        }
        if (!$product) {
            return response()->json(['message' => 'item not found'], 400);
        }
        $existingItem = CartItem::where([
            ['customer_id', $customer->id],
            ['product_id', $product->id],
        ])->first();
        if ($existingItem) {
            $existingItem->increment('quantity', 1);
            return response()->json(['message' => 'Item quantity updated successfully'], 200);
        } else {
            $added = CartItem::create([
                'customer_id' => $customer->id,
                'product_id' => $product->id,
                'quantity' => 1
            ]);
            if ($added) {
                return response()->json(['message' => 'Item added to cart successfully'], 200);
            } else {
                return response()->json(['message' => 'Item was not added to cart'], 400);
            }
        }
    }

    public function remove_item(Request $request, CartItem $cartItem)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer; // This will return the error response if authentication failed
        }
        if ($cartItem->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized access to cart item'], 403);
        }

        if ($cartItem->delete()) {
            return response()->json(['message' => 'Item removed from cart successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to remove item from cart'], 400);
        }
    }

    public function update_item(Request $request, CartItem $cartItem)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer; // This will return the error response if authentication failed
        }

        if ($cartItem->customer_id !== $customer->id) {
            return response()->json(['message' => 'Unauthorized access to cart item'], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->quantity = $request->quantity;

        if ($cartItem->save()) {
            return response()->json(['message' => 'Item quantity updated successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to update item quantity'], 400);
        }
    }

    public function clear_cart(Request $request)
    {
        $cx = new CustomerController();
        $customer = $cx->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer; // This will return the error response if authentication failed
        }

        if ($customer->cartItems()->delete()) {
            $existingPrescription = Prescription::where('customer_id', $customer->id)
                ->where('status', 'pending')
                ->first();
            if ($existingPrescription) {
                Storage::disk('public')->delete($existingPrescription->file_path);
                $existingPrescription->delete();
            }

            // remove prescription with pending 
            return response()->json(['message' => 'Cart cleared successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to clear cart'], 400);
        }
    }
}
