<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use App\Models\UserRole;
use Illuminate\Http\Request;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $code = '';
        if ($user) {
            $role = UserRole::find($user->user_role_id);
            $code = $role ? $role->code : '';
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'role_code'=> $code
            ],
        ];
    }
}
