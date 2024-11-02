<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OrderPaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {

        $merchantId = env('PHONEPE_MERCHANT_ID');
        $apiKey = env('PHONEPE_API_KEY');
        $order_id = uniqid();
        $amount = $request->input('amount') * 100; // Convert to paise
        $mobile = $request->input('mobile');
        $description = 'Payment for Product/Service';
        $success_url = $request->input('success_url');
        $failed_url = $request->input('failed_url');

        $paymentData = [
            'merchantId' => $merchantId,
            'merchantTransactionId' => uniqid('MT'),
            'amount' => $amount,
            'redirectUrl' => $success_url,
            'redirectMode' => 'POST',
            'mobileNumber' => $mobile,
            'message' => $description,
            'paymentInstrument' => [
                'type' => 'PAY_PAGE',
            ],
        ];


        $payload = base64_encode(json_encode($paymentData));
        $string = $payload . "/pg/v1/pay" . $apiKey;
        $sha256 = hash("sha256", $string);
        $final_x_header = $sha256 . '###1';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-VERIFY' => $final_x_header,

        ])->post("https://api.phonepe.com/apis/hermes/pg/v1/pay", json_encode(['request' => $payload]));

        $res = json_decode($response->getBody());

        if (isset($res->success) && $res->success == '1') {
            return response()->json($res->data->instrumentResponse->redirectInfo->url);
        } else {
            return response()->json(['error' => 'Payment initiation failed.'], 500);
        }
    }

    public function paymentCallback(Request $request)
    {
        $paymentStatus = $request->input('status');
        $transactionId = $request->input('transactionId');
        $orderId = $request->input('orderId');

        if ($paymentStatus === 'SUCCESS') {
            return response()->json(['message' => 'Payment successful', 'transactionId' => $transactionId]);
        } else {
            return response()->json(['error' => 'Payment failed'], 400);
        }
    }
}
