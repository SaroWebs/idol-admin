<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\CustomerLogin;

class CustomerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('Authorization') ? explode(' ', $request->header('Authorization'))[1] : null;
        if (!$token) {
            return response()->json(['error' => 'Token is required'], 401);
        }

        $customerLogin = CustomerLogin::where('token', $token)->first();
        if (!$customerLogin) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        if ($customerLogin->token_expired_at && $customerLogin->token_expired_at < now()) {
            return response()->json(['error' => 'Token has expired'], 401);
        }
        $c = $customerLogin->customer()->first();
        if (!$c) {
            return response()->json(['error' => 'No User'], 404);
        }
        $request->merge(['customer_id' => $c->id]);
        return $next($request);
    }
}
