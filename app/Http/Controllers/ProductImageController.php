<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
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
    public function store(Request $request, Product $product)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'images' => 'required|array',
            'images.*' => 'file|mimes:jpeg,png,jpg,gif|max:2048', // Specify allowed file types and max size
        ]);

        $uploadedImages = [];

        try {
            // Loop through each uploaded image
            foreach ($validatedData['images'] as $image) {
                // Store the image and get the path
                $imagePath = $image->store('images/product', 'public');

                // Create a new ProductImage record
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                ]);

                // Store the uploaded image path for the response
                $uploadedImages[] = $imagePath;
            }

            // Return a JSON response with success status and uploaded image paths
            return response()->json([
                'status' => 'success',
                'message' => 'Product images uploaded successfully.',
                'uploaded_images' => $uploadedImages,
            ], 201); // 201 Created status code

        } catch (\Exception $e) {
            // Handle any exceptions that may occur
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload images: ' . $e->getMessage(),
            ], 500); // 500 Internal Server Error status code
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $productImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $productImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductImage $productImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $productImage)
    {
        try {
            $imagePath = $productImage->image_path;

            Storage::disk('public')->delete($imagePath);

            $productImage->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product image deleted successfully.',
            ], 200); // 200 OK status code

        } catch (\Exception $e) {
            // Handle any exceptions that may occur
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500); // 500 Internal Server Error status code
        }
    }
}
