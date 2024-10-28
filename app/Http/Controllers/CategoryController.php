<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
		$request->validate([
			'name' => 'required|string|max:255',
			'description' => 'nullable|string',
			'icon' => 'nullable|mimes:jpeg,png,jpg,gif,svg|max:2048',
			'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
			'status' => 'required|boolean'
		]);

		$data = [
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'status' => $request->input('status')
		];

		// Store icon file if uploaded
		if ($request->hasFile('icon')) {
			$iconPath = $request->file('icon')->store('images/category-icon', 'public');
			$data['icon_path'] = $iconPath;
		}

		// Store image file if uploaded
		if ($request->hasFile('image')) {
			$imagePath = $request->file('image')->store('images/category-image', 'public');
			$data['image_path'] = $imagePath;
		}

		// Create the category
		$category = Category::create($data);

		return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
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
		// Validate the incoming request data
		$validatedData = $request->validate([
			'name' => 'nullable|string|max:255',
			'description' => 'nullable|string',
			'icon' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
			'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
		]);

		// Update the category's basic information
		$category->name = $validatedData['name'] ?? $category->name;
		$category->description = $validatedData['description'] ?? $category->description;

		// Handle the icon upload
		if ($request->hasFile('icon')) {
			if ($category->icon_path) {
				Storage::disk('public')->delete($category->icon_path);
			}

			$iconPath = $request->file('icon')->store('images/category-icon', 'public');
			$category->icon_path = $iconPath;
		}

		// Handle the image upload
		if ($request->hasFile('image')) {
			if ($category->image_path) {
				Storage::disk('public')->delete($category->image_path);
			}
			$imagePath = $request->file('image')->store('images/category-image', 'public');
			$category->image_path = $imagePath;
		}

		// Save the updated category
		$category->save();

		// Optionally, return a response
		return response()->json([
			'message' => 'Category updated successfully',
			'category' => $category,
		], 200);
	}
	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Category $category)
	{
		// Start the database transaction
		DB::beginTransaction();

		try {
			// Check and delete the category's icon and image if they exist
			if ($category->icon_path) {
				Storage::disk('public')->delete($category->icon_path);
			}

			if ($category->image_path) {
				Storage::disk('public')->delete($category->image_path);
			}

			// Delete the category from the database
			$category->delete();

			// Commit the transaction
			DB::commit();

			// Return a successful response
			return response()->json(['message' => 'Category deleted successfully.'], 200);
		} catch (\Exception $e) {
			// Rollback the transaction on error
			DB::rollBack();

			// Return an error response
			return response()->json(['error' => 'Failed to delete category.'], 500);
		}
	}

	// api
	public function get_all()
	{
		$cats = Category::get();
		return response()->json($cats);
	}

	public function get_items()
	{
		$user = Auth::user();
		$query = Category::query();

		if (!$user) {
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
		$cat = Category::with('subcategories')->where('id', $id)->first();
		return response()->json($cat);
	}
}
