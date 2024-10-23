<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Welcome', [
            'appVersion' => config('app.version'),
        ]);
    }

    public function dashboard()
    {
        return Inertia::render('Sections/Dashboard');
    }
    
    public function categories()
    {
        return Inertia::render('Sections/Categories');
    }

    public function customers()
    {
        return Inertia::render('Sections/Customers');
    }

    public function medicine()
    {
        return Inertia::render('Sections/Medicine');
    }

    public function orders()
    {
        return Inertia::render('Sections/Orders');
    }
    
    public function trips()
    {
        return Inertia::render('Sections/Trips');
    }
    
    public function settings()
    {
        return Inertia::render('Sections/Settings');
    }
}
