<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PincodesController;
use App\Http\Controllers\CoreImageController;
use App\Http\Controllers\OrderPaymentController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\DeliveryChargeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::controller(HomeController::class)->group(function(){
    Route::get('/', 'index');
});

Route::get('/link-storage', function () {
    Artisan::call('storage:link');
    return "Storage link has been created successfully!";
});


Route::middleware('auth')->group(function () {
    Route::controller(HomeController::class)->group(function(){
        Route::get('/home', 'dashboard')->name('home');
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/categories', 'categories');
        Route::get('/medicine', 'medicine');
        Route::get('/products', 'medicine');
        Route::get('/customers', 'customers');
        Route::get('/orders', 'orders');
        Route::get('/invoice/{code}', 'invoice');
        Route::get('/order/new', 'new_order');
        Route::get('/trips', 'trips');
        Route::get('/settings', 'settings');
        Route::get('/d/account', 'delivery_account');
        Route::get('/d/orders', 'delivery_orders');

        Route::get('/data/users', 'getUsers'); // Fetch all users
        Route::post('/data/users', 'storeUser');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    Route::controller(CategoryController::class)->group(function () {
        Route::get('/data/categories', 'get_all');
        Route::post('/categories/new', 'store');
        Route::post('/categories/{category}/update', 'update');
        Route::delete('/data/categories/{category}', 'destroy');
    });

    Route::controller(CustomerController::class)->group(function(){
        Route::get('data/customers', 'getCustomers');
        Route::post('customers/new', 'store');
        Route::post('customers/{customer}/update', 'update');
        Route::delete('customers/{customer}', 'destroy');

    });
    Route::controller(OrderController::class)->group(function(){
        Route::get('data/orders/all', 'getAllOrders');
        Route::get('data/orders', 'get_orders_data');
        Route::get('data/order/{order}', 'getOrderInfo');
        Route::get('order_item/{orderItem}/status/get', 'item_status');
        Route::post('order-item/{orderItem}/cancel', 'cancel_order_item_by_delivery');
        Route::post('order/{order}/cancel', 'cancelOrder');
        Route::post('order/{order}/approve', 'approveOrder');
        Route::post('order/{order}/process', 'processOrder');
        Route::post('order/{order}/deliver', 'deliverOrder');
        Route::post('order/create', 'store');
    });

    Route::controller(ProductController::class)->group(function(){
        Route::get('data/products', 'getProductsData');
        Route::post('data/product', 'store');
        Route::post('data/product/{product}/update', 'update');
        Route::get('/product/code/{code}/check', 'check_code');
        Route::get('/products/export', 'exportCSV');
    });

    Route::controller(ProductImageController::class)->group(function(){
        Route::post('/product/{product}/product-image/new', 'store');
        Route::delete('/product-image/{productImage}', 'destroy');
    });

    Route::controller(PincodesController::class)->group(function(){
        Route::get('/data/pincode/list', 'pincode_list');
        Route::post('/data/pincode/create', 'store');
        Route::put('/data/pincode/edit/{pincode}', 'update');
    });

    Route::controller(TripController::class)->group(function(){
        Route::get('/data/trips', 'getData');
        Route::post('/trip/new', 'store');
        Route::post('/trip/assign-order', 'assignOrder');
        Route::get('/orders/processed/get', 'getProcessedOrder');
        
        Route::post('/data/delivery/trips/{user}', 'getDriversTrip');
        // Route::post('/data/delivery/trips/{tripItem}/deliver', 'deliverTripItem');
        // Route::post('/data/delivery/trips/{tripItem}/cancel', 'cancelTripItem');
        
    });

    Route::controller(CoreImageController::class)->group(function(){
        Route::get('/data/core-images/banner', 'getBannersData');
        Route::post('/core-image/banner/new', 'store');
        Route::delete('/data/core-images/banner/{coreImage}', 'destroy');
    });

    Route::controller(PrescriptionController::class)->group(function(){
        Route::get('/data/prescriptions/unassigned', 'get_unassigned_items');
        Route::get('/data/order/{order}/prescriptions', 'precription_by_order');
    });

    Route::controller(DeliveryChargeController::class)->group(function(){
        Route::get('/data/getdch', 'getCharge');
        Route::post('/data/dch/update', 'update');
    });



});

require __DIR__.'/auth.php';
