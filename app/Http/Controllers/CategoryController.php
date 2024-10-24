<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }

    // api
    public function get_all() {
        $cats = Category::get();    
        return response()->json($cats);
    }
    
    public function get_items() {
        $user = Auth::user(); 
        $query = Category::query();
        
        if(!$user) {
            $query->where('status', 1);
        }

        $cats = $query->get();    
        return response()->json($cats);
    }
    

    public function getcategories(Request $request)
    {
        $perPage = $request->query('per_page', 20);
        $page = $request->query('page', 1);
        $categories = Category::paginate($perPage, ['*'], 'page', $page);
        return response()->json($categories);
    }


    public function getcategory($id)
    {
        $cat = Category::with('subcategories')->where('id',$id)->first();
        return response()->json($cat);
    }
}
