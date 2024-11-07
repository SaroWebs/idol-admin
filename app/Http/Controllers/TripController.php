<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Trip;
use App\Models\Order;
use App\Models\TripItem;
use Illuminate\Http\Request;

class TripController extends Controller
{
    //getData

    public function getData(Request $request)
    {
        $request->validate([
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'search' => 'string|nullable',
        ]);

        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $searchTerm = $request->input('search', '');

        $query = Trip::with(['user', 'tripItems']);

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('user_id', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('instructions', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhereDate('trip_date', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $trips = $query->orderBy('trip_date', 'desc')
            ->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json($trips);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'trip_date' => 'required', // Ensure the date is today or in the future
            'user_id' => 'required|exists:users,id', // Ensure the driver exists in the users table
            'instructions' => 'nullable|string|max:255', // Optional instructions
        ]);
        $tripDate = Carbon::parse($validatedData['trip_date']);
        $trip = Trip::create([
            'trip_date' => $tripDate,
            'user_id' => $validatedData['user_id'],
            'instructions' => $validatedData['instructions'] ?? null,
        ]);

        return response()->json([
            'message' => 'Trip created successfully',
            'trip' => $trip,
        ], 201); // 201 Created
    }

    public function getProcessedOrder()
    {
        $orders = Order::where('status', 'processed')->get();
        return response()->json($orders);
    }

    
    public function assignOrder(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'trip_id' => 'required|exists:trips,id',
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|string',
            'receivable_amount' => 'required|numeric',
        ]);
    
        // Find the order by ID
        $order = Order::find($request->order_id);
        if (!$order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }
    
        // Update the order status
        $order->status = 'onway'; // Assuming 'onway' is the new status
        $order->save();
    
        // Create a new TripItem record
        $tripItem = new TripItem();
        $tripItem->trip_id = $request->trip_id;
        $tripItem->order_id = $order->id;
        $tripItem->status = $request->status; // e.g., 'out_of_delivery'
        $tripItem->receivable_amount = $request->receivable_amount;
        
        // Save the TripItem
        if ($tripItem->save()) {
            return response()->json(['message' => 'Order assigned successfully.', 'trip_item' => $tripItem], 201);
        } else {
            return response()->json(['message' => 'Failed to assign the order.'], 500);
        }
    }

    public function getDriversTrip(Request $request)
    {
        # code...
    }
}
