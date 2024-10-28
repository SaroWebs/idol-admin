<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;

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
    Route::get('/test', 'test');
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
        Route::get('/trips', 'trips');
        Route::get('/settings', 'settings');
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
        Route::post('order/{order}/cancel', 'cancelOrder');
        Route::post('order/{order}/approve', 'approveOrder');
        Route::post('order/{order}/process', 'processOrder');
    });
    Route::controller(ProductController::class)->group(function(){
        Route::get('data/products', 'getProductsData');
    });
});

require __DIR__.'/auth.php';
