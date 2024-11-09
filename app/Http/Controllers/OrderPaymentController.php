<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OrderPaymentController extends Controller
{
   public function initiatePayment(Request $request)
        {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'mobile' => 'required|digits:10',
                'order_no' => 'required|string',
            ]);
            if($request->input('order_no')){
                $o_id = $request->input('order_no');
            }else{
                $o_id = uniqid();
            }
        $merchantId = env('PHONEPE_MERCHANT_ID');
        $apiKey = env('PHONEPE_API_KEY');
        $orderId = $o_id;
        $amount = $request->input('amount') * 100; // Convert amount to paise
        $mobile = $request->input('mobile');
        $callbackUrl = route('payment.callback');
        $redirectUrl = env('FRONTEND_URL') . '/payment-success?orderNo='.$orderId;
    
        $paymentData = [
            'merchantId' => $merchantId,
            'merchantTransactionId' => uniqid('MT_'),
            'amount' => $amount,
            'callbackUrl' => $callbackUrl,
            // 'redirectUrl' => $redirectUrl,
            'redirectMode' => 'POST',
            'mobileNumber' => $mobile,
            'paymentInstrument' => [
                'type' => 'PAY_PAGE',
            ],
        ];
    
        $payloadMain = base64_encode(json_encode($paymentData));
        $saltIndex = 1; // Use key index 1
        $stringToHash = $payloadMain . "/pg/v1/pay" . $apiKey;
        $sha256 = hash("sha256", $stringToHash);
        $finalXHeader = $sha256 . '###' . $saltIndex;
    
        // Send the request to PhonePe
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-VERIFY' => $finalXHeader,
        ])->post("https://api.phonepe.com/apis/hermes/pg/v1/pay", [
            'request' => $payloadMain,
        ]);
    
        $res = json_decode($response->getBody(), true);
    
        if ($res['success'] ?? false) {
            // Redirect user to payment URL
            $payUrl = $res['data']['instrumentResponse']['redirectInfo']['url'];
            return response()->json(['paymentUrl' => $payUrl]);
        } else {
            return response()->json(
                [
                    'error' => $res['message'] ?? 'Payment initiation failed.',
                    'payment_data'=> $paymentData
                ], 500);
        }
    }


    public function paymentCallback(Request $request)
    {
        $paymentStatus = $request->input('status');
        $transactionId = $request->input('transactionId');
        $orderId = $request->input('orderId');
    
        // Find the order using the `orderId`
        $order = Order::where('order_no', $orderId)->first();
    
        if ($paymentStatus === 'SUCCESS') {
            if ($order) {
                $order->payment_status = 'paid';
                $order->transaction_id = $transactionId;
                $order->save();
            }
            return redirect(env('FRONTEND_URL') . '/payment-success?status=success&orderNo='.$orderId.'&transactionId='.$transactionId);
        } else {
            if ($order) {
                $order->payment_status = 'failed';
                $order->transaction_id = $transactionId;
                $order->save();
            }
            return redirect(env('FRONTEND_URL') . '/payment-failure?status=failed&orderNo=' . $orderId.'&transactionId='.$transactionId);
        }
    }

}
