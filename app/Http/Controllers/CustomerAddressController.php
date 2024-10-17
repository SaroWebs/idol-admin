<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomerAddress;
use App\Http\Controllers\CustomerController;

class CustomerAddressController extends Controller
{
   
    public function activate(Request $request, CustomerAddress $address) {
        $customerController = new CustomerController();
        $customer = $customerController->get_customer($request);

        if ($address->customer_id !== $customer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        CustomerAddress::where('customer_id', $customer->id)
            ->where('id', '!=', $address->id)
            ->update(['active' => 0]);

        $address->active = 1;
        $address->save();

        return response()->json(['message' => 'Address activated successfully'], 200);
    }

    public function get_addresses(Request $request)
    {
        $customerController = new CustomerController();
        $customer = $customerController->get_customer($request);

        $addresses = CustomerAddress::where('customer_id', $customer->id)->get();

        return response()->json($addresses, 200);
    }

    public function store(Request $request)
    {
        $customerController = new CustomerController();
        $customer = $customerController->get_customer($request);

        $validatedData = $request->validate([
            'type' => 'nullable|in:home,work,other',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'pin' => 'nullable|string|max:20',
        ]);
        
        $address = new CustomerAddress($validatedData);
        $address->customer_id = $customer->id;
        $address->active = CustomerAddress::where('customer_id', $customer->id)->count() === 0 ? 1 : 0;
        $address->save();

        return response()->json(['message' => 'Address created successfully', 'address' => $address], 201);
    }

    public function update(Request $request, CustomerAddress $address)
    {
        $customerController = new CustomerController();
        $customer = $customerController->get_customer($request);

        if ($address->customer_id !== $customer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'type' => 'nullable|in:home,work,other',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'address_line_1' => 'nullable|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'pin' => 'nullable|string|max:20',
        ]);

        $address->update($validatedData);

        return response()->json(['message' => 'Address updated successfully', 'address' => $address], 200);
    }
}
