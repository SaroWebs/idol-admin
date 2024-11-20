<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use App\Models\Trip;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Pincodes;
use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Models\DeliveryCharge;
use Illuminate\Support\Facades\Hash;

class HomeController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Welcome', [
            'appVersion' => config('app.version'),
        ]);
    }

    public function test()
    {
        return Inertia::render('TestPage');
    }

    public function invoice($code)
    {
        $order = Order::where('order_no', $code)->with(['order_items.statuses', 'order_items.product','customer','customer_address'])->first();
        return Inertia::render('Sections/Invoice',['order'=>$order]);
    }

    public function dashboard()
    {
        $total_customers = Customer::count();
        $total_orders = Order::count();
        $total_medicines = Product::count();
        $total_trips = Trip::count();
        return Inertia::render('Sections/Dashboard',[
            'total_customers'=>$total_customers,
            'total_orders'=>$total_orders,
            'total_medicines'=>$total_medicines,
            'total_trips'=>$total_trips,
        ]);
    }
    
    public function categories()
    {
        return Inertia::render('Sections/Categories');
    }

    public function customers()
    {
        return Inertia::render('Sections/Customers');
    }

    public function medicine()
    {
        $cats = Category::get();
        $taxes = Tax::get();
        return Inertia::render('Sections/Medicine/index',[
            'categories'=> $cats,
            'taxes'=>$taxes
        ]);
    }

    public function orders()
    {
        return Inertia::render('Sections/Orders');
    }

    public function new_order()
    {
        $customers = Customer::with(['addresses'])->get();
        $pins = Pincodes::get();
        $charge_upto = 0;
        $per_km = 0;
        $charge_options = DeliveryCharge::first();
        if($charge_options){
            $charge_upto = $charge_options->charge_upto;
            $per_km = $charge_options->per_km;
        }

        return Inertia::render('Sections/Order/NewOrder',[
            'customers'=>$customers, 
            'pins'=>$pins,
            'charge_limit'=>$charge_upto,
            'per_km'=>$per_km
        ]);
    }
    public function trips()
    {
        $drivers = User::whereHas('role', function ($query) {
            $query->where('code', 4);
        })->get();

        return Inertia::render('Sections/Trips',[
            'drivers'=>$drivers
        ]);
    }
    
    public function settings()
    {
        $roles = UserRole::get();
        return Inertia::render('Sections/Settings',['roles'=>$roles]);
    }
    
    public function delivery_account()
    {
        return Inertia::render('Sections/Delivery/Account');
    }
    public function delivery_orders()
    {
        return Inertia::render('Sections/Delivery/OrdersList');
    }


    public function getUsers()
    {
        $users = User::with('role')->get(); // Assumes User model has a 'role' relationship
        return response()->json($users);
    }

    // Store a new user with role assignment
    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'password' => 'required|string|min:8',
            'user_role_id' => 'required',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'password' => Hash::make($request->input('password')),
            'user_role_id' => $request->input('user_role_id'), // Role assignment
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }
}
