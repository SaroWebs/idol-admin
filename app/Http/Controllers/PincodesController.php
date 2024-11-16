<?php

namespace App\Http\Controllers;

use App\Models\Pincodes;
use Illuminate\Http\Request;
use App\Models\DeliveryCharge;

class PincodesController extends Controller
{
    /**
     * List all pincodes.
     */
    public function pincode_list()
    {
        $pincodes = Pincodes::all(); // Retrieve all records
        return response()->json($pincodes);
    }

    /**
     * Update a specific pincode.
     */
    public function update(Request $request, Pincodes $pincode)
    {
        $validated = $request->validate([
            'pin' => 'required|string|max:10',
            'distance' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'active' => 'required|boolean',
        ]);

        $pincode->update($validated);

        return response()->json([
            'message' => 'Pincode updated successfully',
            'pincode' => $pincode,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'pin' => 'required|string|max:10|unique:pincodes,pin',
            'distance' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'active' => 'required|boolean',
        ]);

        $pincode = Pincode::create($validated);

        return response()->json([
            'message' => 'Pincode created successfully',
            'pincode' => $pincode,
        ], 201); // 201 status code indicates resource creation
    }


    public function pin_check(Request $request) {
        $pin = $request->input('pin');
        $exists = Pincodes::where('pin', $pin)->exists();
        if ($exists) {
            return response()->json(['message' => 'Pin exists'], 200);
        } else {
            return response()->json(['error' => 'Pin not found'], 404);
        }
    }

    public function after_charge(Request $request) {
        $pin = $request->input('pin');
        $amount = $request->input('amount');
        $drop_point = Pincodes::where('pin', $pin)->first();
        if(!$drop_point){
            return response()->json(['amount'=> $amount, 'message'=> 'This pin is unavailable'], 400);
        }

        $distance = $drop_point->distance;
        $charge_options = DeliveryCharge::first();
        $updated_amount = 0;
        if($charge_options){
            if($amount < $charge_options->charge_upto){
                $charge = $distance * $charge_options->per_km;
            }else{
                $charge = 0;
            }
            $updated_amount = $amount + $charge;
        }else{
            $updated_amount = $amount;
        }
        
        return response()->json(['amount'=> number_format($updated_amount, 2,'.','')], 200);
    }
}
