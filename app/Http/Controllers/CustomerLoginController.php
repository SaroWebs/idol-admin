<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Models\CustomerLogin;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class CustomerLoginController extends Controller
{
    
    public function sendOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $phone = preg_replace('/^\+91/', '', $request->phone);

        $customer = Customer::firstOrCreate(['phone' => $phone]);

        $otp = $this->generateOtp();
        
        if ($this->send_message($phone, $otp)) {
            CustomerLogin::updateOrCreate(
                ['customer_id' => $customer->id],
                [
                    'otp' => $otp,
                    'otp_expired_at' => now()->addMinutes(720),
                ]
            );
            return response()->json([
                'message' => 'OTP sent successfully',
                'isNewUser' => $customer->wasRecentlyCreated,
                // 'otp'=>$otp, // for now just send otp for testing
            ]);
        }else{
            return response()->json([
                'message' => 'OTP could not be sent',
            ]);
        }
    }
    
    public function verifyOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string|size:4',
        ]);

        $phone = preg_replace('/^\+91/', '', $request->phone);
        $customer = Customer::where('phone', $phone)->first();

        if (!$customer) {
            return response()->json(['success' => false, 'message' => 'Customer not found'], 404);
        }

        $customerLogin = CustomerLogin::where('customer_id', $customer->id)->first();

        if (!$customerLogin || $customerLogin->otp !== $request->otp) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP'], 400);
        }

        if ($request->has('name') && $request->has('email')) {
            $customer->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);
        }

        // Generate and encrypt the token
        $token = $this->generateEncryptedToken($customer->id);

        $customerLogin->update([
            'otp' => null,
            'otp_expired_at' => null,
            'token' => $token,
            'token_expired_at' => now()->addDays(30),
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'message' => 'OTP verified successfully',
        ]);
    }
    
    private function generateOtp()
    {
        return sprintf('%04d', mt_rand(0, 9999));
    }

    private function generateEncryptedToken($customerId)
    {
        $dataToEncrypt = json_encode([
            'customer_id' => $customerId,
            'created_at' => now()->timestamp,
        ]);

        return Crypt::encryptString($dataToEncrypt);
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
}
