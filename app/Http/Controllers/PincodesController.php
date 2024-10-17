<?php

namespace App\Http\Controllers;

use App\Models\Pincodes;
use Illuminate\Http\Request;

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
}
