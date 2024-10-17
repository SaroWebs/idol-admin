<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OTPController extends Controller
{
    public function send_otp(Request $request)
    {
        $request->validate(['phone' => 'required']);
        $ph = $request->input('phone');
        $c = rand(100000, 999999);
        if ($this->send_message($ph, $c)) {
            $customer = Customer::where('phone', $ph)->first();
            if (!$customer) {
                $customer = new Customer();
                $customer->phone = $ph;
            }
            $customer->otp = $c;
            $customer->save();

            return response()->json([
                'message' => 'OTP sent!',
                'test' => $c
            ]);
        }
    }

    public function verify_otp(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'otp' => 'required'
        ]);
        $ph = $request->input('phone');
        $code = $request->input('otp');
        $customer = Customer::where('phone', $ph)->first();
        if ($customer->otp == $code) {
            $t = Str::random(20);
            $customer->token = $t;
            $customer->otp = '';
            $customer->save();
            return response()->json([
                'message' => 'OTP verified',
                'token'=> $t
            ]);
        }
    }

    private function send_message($phone, $code)
    {
        // 
        return true;
    }

    public function verify_user(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);
        $tk = $request->input('token');

        $customer = Customer::where('token', $tk)->first();

        if ($customer) {
            return response()->json([
                'message' => 'User verified',
                'user'=> $customer
            ]);
        }
    }
}
