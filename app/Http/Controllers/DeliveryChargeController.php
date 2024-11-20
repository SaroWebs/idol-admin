<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeliveryCharge;

class DeliveryChargeController extends Controller
{
    public function getCharge()
    {
        $dc = DeliveryCharge::first();
        if(!$dc){
            $dc = DeliveryCharge::create([
                'charge_upto'=>1000,
                'per_km'=>10
            ]);
        }
        return response()->json($dc);
    }


    public function update(Request $request)
    {
        $request->validate([
            'per_km' => 'required', // Corrected spelling
            'charge_upto' => 'required'
        ]);

        $dc = DeliveryCharge::first();
        $dc->per_km = $request->per_km;
        $dc->charge_upto = $request->charge_upto;
        $dc->save();

        return response()->json(['message'=>'updated', 'Charge'=> $dc]);
    }

}
