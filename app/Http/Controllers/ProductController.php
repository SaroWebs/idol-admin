<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{


    public function getProductsData(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $sortBy = $request->input('sort_by', 'name');
        $sort = $request->input('sort', 'asc');
        $searchTerm = $request->input('search', ''); // Get the search term from the request

        // Fetch products with images, applying search filter if provided
        $query = Product::with('images');

        // Apply search filter if a search term is provided
        if (!empty($searchTerm)) {
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('code', 'like', '%' . $searchTerm . '%');
            });
        }

        // Order and paginate the results
        $products = $query->orderBy($sortBy, $sort)
            ->paginate($perPage, ['*'], 'page', $page);

        // Assuming you have a method to get categories by their IDs
        $categories = $this->getCategoriesByIds($products->pluck('category_id')->unique());

        // Add category information to each product
        $products->getCollection()->transform(function ($product) use ($categories) {
            $product->category = $categories[$product->category_id] ?? null; // Add category or null if not found
            return $product;
        });

        return response()->json($products);
    }

    public function exportCSV()
    {
        $filename = 'products.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');

            // Add CSV headers
            fputcsv($handle, [
                'Name',
                'Code',
                'Details',
                'Top (Y/N)',
                'Featured (Y/N)',
                'Key Details',
                'Description Details',
                'SIP Details',
                'Other Details',
                'Price',
                'Discount',
                'Offer Price',
                'Manufacturer Name',
                'Total Quantity',
                'Alert Quantity',
                'Category ID',
                'Subcategory ID',
                'Tax ID',
                'Prescription (1/0)',
                'Status (0/1)',
                'Returnable (0/1)',
                'Return Time (Days)',
            ]);

            // Fetch and process data in chunks
            Product::chunk(25, function ($products) use ($handle) {
                foreach ($products as $product) {
                    $data = [
                        $product->name,
                        $product->code,
                        $product->details,
                        $product->top ? 'Y' : 'N',
                        $product->feat ? 'Y' : 'N',
                        $product->k_details,
                        $product->d_details,
                        $product->sip_details,
                        $product->o_details,
                        $product->price,
                        $product->discount,
                        $product->offer_price,
                        $product->mfg_name,
                        $product->total_qty,
                        $product->alert_qty,
                        $product->category_id,
                        $product->subcategory_id ?? '', // Handle null
                        $product->tax_id,
                        $product->prescription,
                        $product->status,
                        $product->returnable,
                        $product->return_time,
                    ];

                    fputcsv($handle, $data);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
    /**
     * This method would return an associative array of categories keyed by their ID.
     * You should implement this method to fetch categories from your database or any other source.
     */
    private function getCategoriesByIds($categoryIds)
    {
        // Assuming you have a Category model
        return Category::whereIn('id', $categoryIds)->get()->keyBy('id')->toArray();
    }

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

    public function check_code($code)
    {
        $exists = Product::where('code', $code)->exists();

        return response()->json([
            'available' => !$exists
        ], $exists ? 409 : 200);
    }

    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:products,code|max:255',
            'details' => 'nullable|string',
            'top' => 'nullable|in:Y,N',
            'feat' => 'nullable|in:Y,N',
            'k_details' => 'nullable|string',
            'd_details' => 'nullable|string',
            'sip_details' => 'nullable|string',
            'o_details' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'offer_price' => 'nullable|numeric|min:0',
            'mfg_name' => 'nullable|string|max:255',
            'total_qty' => 'nullable|integer|min:0',
            'alert_qty' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'prescription' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'returnable' => 'nullable|boolean',
            'return_time' => 'nullable|integer|min:0'
        ]);

        // Create a new product with defaults as specified in the schema
        $product = new Product();
        $product->name = $request->name;
        $product->code = $request->code;
        $product->details = $request->details;
        $product->top = $request->top;
        $product->feat = $request->feat;
        $product->k_details = $request->k_details;
        $product->d_details = $request->d_details;
        $product->sip_details = $request->sip_details;
        $product->o_details = $request->o_details;
        $product->price = $request->price ?? 0.00;
        $product->discount = $request->discount ?? 0.00;
        $product->offer_price = $request->offer_price ?? ($product->price - ($product->price * $product->discount / 100));
        $product->mfg_name = $request->mfg_name;
        $product->total_qty = $request->total_qty ?? 0;
        $product->alert_qty = $request->alert_qty ?? 5;
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id;
        $product->prescription = $request->prescription ?? 0;
        $product->status = $request->status ?? 0;
        $product->returnable = $request->returnable ?? 0;
        $product->return_time = $request->returnable ? ($request->return_time ?? 0) : 0;

        // Save the product to the database
        $product->save();

        // Return a success response
        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        // Validate incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|unique:products,code,' . $product->id . '|max:255',
            'details' => 'nullable|string',
            'top' => 'nullable|in:Y,N',
            'feat' => 'nullable|in:Y,N',
            'k_details' => 'nullable|string',
            'd_details' => 'nullable|string',
            'sip_details' => 'nullable|string',
            'o_details' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'offer_price' => 'nullable|numeric|min:0',
            'mfg_name' => 'nullable|string|max:255',
            'total_qty' => 'nullable|integer|min:0',
            'alert_qty' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'prescription' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'returnable' => 'nullable|boolean',
            'return_time' => 'nullable|integer|min:0'
        ]);

        // Update product attributes
        $product->name = $request->name;
        $product->code = $request->code;
        $product->details = $request->details;
        $product->top = $request->top;
        $product->feat = $request->feat;
        $product->k_details = $request->k_details;
        $product->d_details = $request->d_details;
        $product->sip_details = $request->sip_details;
        $product->o_details = $request->o_details;
        $product->price = $request->price ?? $product->price; // Keep existing if not provided
        $product->discount = $request->discount ?? $product->discount; // Keep existing if not provided
        $product->offer_price = $request->offer_price ?? ($product->price - ($product->price * $product->discount / 100));
        $product->mfg_name = $request->mfg_name;
        $product->total_qty = $request->total_qty ?? $product->total_qty; // Keep existing if not provided
        $product->alert_qty = $request->alert_qty ?? $product->alert_qty; // Keep existing if not provided
        $product->category_id = $request->category_id;
        $product->tax_id = $request->tax_id ?? '';
        $product->prescription = $request->prescription ?? $product->prescription; // Keep existing if not provided
        $product->status = $request->status ?? $product->status; // Keep existing if not provided
        $product->returnable = $request->returnable ?? $product->returnable; // Keep existing if not provided
        $product->return_time = $request->returnable ? ($request->return_time ?? $product->return_time) : 0;

        // Save the updated product to the database
        $product->save();

        // Return a success response
        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product
        ], 200);
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
