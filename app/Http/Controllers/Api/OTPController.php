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
                // 'test' => $c
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

    private function send_message($uphone, $otp)
    {
        $message = 'Hi, '.$otp.' is the OTP for verifying your phone number. - IDOL PHARMA';
        $message = urlencode($message);
        
        $getUrl = 'https://api.100coins.co/v3/getsms?apikey=cF4QgBBX89OHndEDpz3pqx90l2aeKlqc&mtype=0&mask=IDOLON&mobno='.$uphone.'&message='.$message.'&tempid=1707172128544139416&peid=1701170895114755311';
        $ch = curl_init();
    
        curl_setopt($ch, CURLOPT_URL, $getUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        
        if ($result === false) {
            return false;
        } else {
            curl_close($ch);
            return $result;
        }
    
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
