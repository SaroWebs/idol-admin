<?php

namespace App\Http\Controllers;

use App\Models\CoreImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CoreImageController extends Controller
{
    //api
    public function get_banners() {
        $banners = CoreImage::where('type','banner')->where('status', 1)->get();
        return response()->json($banners);
    }

    // system
    public function getBannersData()
    {
        $banners = CoreImage::where('type', 'banner')->get();
        return response()->json($banners);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'title' => 'nullable|string'
        ]);

        $filePath = null;
        if ($request->hasFile('image')) {
            $filePath = $request->file('image')->store('images/banner', 'public');
        }

        $banner = CoreImage::create([
            'image_url' => $filePath,
            'type' => 'banner',
            'heading'=> $request->title,
            'status' => 1,
        ]);

        return response()->json(['message' => 'Banner created successfully', 'data' => $banner], 201);
    }

    public function destroy(CoreImage $coreImage)
    {
        if ($coreImage->type !== 'banner') {
            return response()->json(['error' => 'Not a banner image'], 403);
        }

        if ($coreImage->image_url) {
            Storage::disk('public')->delete($coreImage->image_url);
        }

        $coreImage->delete();

        return response()->json(['message' => 'Banner deleted successfully'], 200);
    }

   


}
