<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Pincodes;
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

    public function calculateCharge($order_id)
    {
        $order = Order::with('customerAddress')->find($order_id);

        if (!$order) {
            return [
                'success' => false,
                'charge' => 0,
                'message' => 'Order not found'
            ];
        }
        
        $pin = $order->customerAddress->pin ?? null;
        if (!$pin) {
            return [
                'success' => false,
                'charge' => 0,
                'error' => 'Customer address or pin not available'
            ];
        }

        $dropPoint = Pincodes::where('pin', $pin)->first();
        if (!$dropPoint) {
            return [
                'success' => false,
                'charge' => 0,
                'error' => 'This pin is unavailable'
            ];
        }

        $chargeOptions = DeliveryCharge::first();
        if (!$chargeOptions) {
            return [
                'success' => false,
                'charge' => 0,
                'error' => 'Delivery charge configuration not found'
            ];
        }

        $charge = ($order->payable_amount < $chargeOptions->charge_upto)
            ? $dropPoint->distance * $chargeOptions->per_km
            : 0;

        return [
            'success' => true,
            'charge' => $charge
        ];
    }

    
}
