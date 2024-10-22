<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{


    public function getproducts(Request $request)
    {
        // Validate query parameters with default values
        $perPage = $request->query('per_page', 20);
        $page = $request->query('page', 1);
        $orderBy = $request->query('order_by', 'name');
        $orderDirection = strtolower($request->query('order_direction', 'asc'));

        // List of valid columns for ordering
        $validColumns = ['id', 'name', 'price'];
        if (!in_array($orderBy, $validColumns)) {
            $orderBy = 'id';  // Default to 'id' if invalid column is provided
        }

        // Ensure the order direction is either 'asc' or 'desc'
        $orderDirection = $orderDirection === 'desc' ? 'desc' : 'asc';

        // Start the product query
        $productsQuery = Product::with('images')->orderBy($orderBy, $orderDirection);

        // Apply filters if present
        if ($request->query('top')) {
            $productsQuery->where('top', 'Y');
        }

        if ($request->query('feature')) {
            $productsQuery->where('feat', 'Y');
        }

        if ($categoryId = $request->query('category')) {
            $productsQuery->where('category_id', $categoryId);
        }

        if ($subcategoryId = $request->query('subcategory')) {
            $productsQuery->where('subcategory_id', $subcategoryId);
        }
        $products = $productsQuery->paginate($perPage, ['*'], 'page', $page);

        $productsArray = $products->toArray();

        if ($categoryId) {
            $category = Category::find($categoryId);
            $productsArray['category'] = $category;
        }

        return response()->json($productsArray);
    }



    public function getitem(Product $product)
    {
        $product->load('images');
        return response()->json($product);
    }

    public function search_item(Request $request)
    {
        $search_text = $request->input('term');

        if ($search_text) {
            $products = Product::where('name', 'like', "%{$search_text}%")
                ->orWhere('price', 'like', "%{$search_text}%")
                ->orWhere('code', 'like', "%{$search_text}%")
                ->orWhere('mfg_name', 'like', "%{$search_text}%")
                ->with('images')
                ->take(50)
                ->get();

            return response()->json($products, 200);
        } else {
            return response()->json(null, 400);
        }
    }

    public function top_items()
    {
        $tp = Product::with(['images'])
            ->where('top', 'Y')
            ->take(6)
            ->get();
        return response()->json($tp, 200);
    }
}
