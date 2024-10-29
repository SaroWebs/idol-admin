<?php

namespace App\Http\Controllers;

use App\Models\Tax;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    
    public function index()
    {
        return Inertia::render('Welcome', [
            'appVersion' => config('app.version'),
        ]);
    }

    public function test()
    {
        return Inertia::render('TestPage');
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
        $cats = Category::get();
        $taxes = Tax::get();
        return Inertia::render('Sections/Medicine/index',[
            'categories'=> $cats,
            'taxes'=>$taxes
        ]);
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
