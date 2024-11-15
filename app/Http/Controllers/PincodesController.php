<?php

namespace App\Http\Controllers;

use App\Models\Pincodes;
use Illuminate\Http\Request;
use App\Models\DeliveryCharge;

class PincodesController extends Controller
{
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
