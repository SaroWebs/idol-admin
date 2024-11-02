<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerLogin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function getCustomers(Request $request){
        $search = $request->search;
        $per_page = $request->per_page ?: 10;  // Default to 10 if per_page is not provided
        $order_by = $request->order_by ?: 'name'; // Default order by 'name'
        $order = $request->order ?: 'asc'; // Default to ascending order

        // Initialize the query
        $query = Customer::query();

        // Apply search filter (assuming 'name', 'email', and 'phone' are searchable)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        // Apply sorting
        if ($order_by && $order) {
            $query->orderBy($order_by, $order);
        }

        // Get paginated data
        $data = $query->paginate($per_page);

        // Return JSON response
        return response()->json($data);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'required|string|max:15',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Optional image file with max size of 2MB
        ]);

        // Initialize the customer data
        $customerData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ];

        // Check if an image is uploaded
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images/customers','public');
            $customerData['image_url'] = Storage::url($path);
        }

        // Create the customer record
        $customer = Customer::create($customerData);

        // Return a success response
        return response()->json([
            'message' => 'Customer created successfully.',
            'customer' => $customer,
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id, // Ignore unique check for the current customer
            'phone' => 'required|string|max:15',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Optional image with max size of 2MB
        ]);

        // Update customer data
        $customer->name = $validated['name'];
        $customer->email = $validated['email'];
        $customer->phone = $validated['phone'];

      
        if ($request->hasFile('image')) {
            if ($customer->image_url) {
                Storage::disk('public')->delete($customer->image_url);                
            }
            $path = $request->file('image')->store('images/customers','public');
            $customer->image_url = $path;
        }

        // Save the updated customer data
        $customer->save();

        // Return a success response
        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $customer,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        // Start the database transaction
        DB::beginTransaction();

        try {
            // Check and delete the customer's profile image if it exists
            if ($customer->image_url) {
             Storage::disk('public')->delete($customer->image_url);   
            }


            // Delete the customer from the database
            $customer->delete();

            // Commit the transaction
            DB::commit();

            // Return a successful response
            return response()->json(['message' => 'Customer deleted successfully.'], 200);
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            // Return an error response
            return response()->json(['error' => 'Failed to delete customer.'], 500);
        }
    }




// Customer login/authentication
    public function get_customer(Request $request)
    {
        $token = $request->header('Authorization') ? explode(' ', $request->header('Authorization'))[1] : null;
        if (!$token) {
            return response()->json(['error' => 'Token is required'], 401);
        }

        $customerLogin = CustomerLogin::where('token', $token)->first();
        if (!$customerLogin) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        if ($customerLogin->token_expired_at && $customerLogin->token_expired_at < now()) {
            return response()->json(['error' => 'Token has expired'], 401);
        }

        $customer = $customerLogin->customer()->first();
        return $customer;
    }
    

    public function authenticate(Request $request){
        $customer = Customer::find($request->customer_id);
        if($customer) {
            $customer->load('addresses');
            return response()->json($customer);
        } else {
            return response()->json(['error' => 'Customer not found'], 404);
        }
    }
}
