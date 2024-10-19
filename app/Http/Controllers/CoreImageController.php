<?php

namespace App\Http\Controllers;

use App\Models\CoreImage;
use Illuminate\Http\Request;

class CoreImageController extends Controller
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
    public function show(CoreImage $coreImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CoreImage $coreImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CoreImage $coreImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CoreImage $coreImage)
    {
        //
    }

    public function get_banners() {
        $banners = CoreImage::where('type','banner')->where('status', 1)->get();
        return response()->json($banners);
    }
}
