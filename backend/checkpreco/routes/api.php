<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\LoginController;
//use App\Http\Controllers\RegisterController;

Route::get('/', function(){
    return "4";
});

Route::controller(LoginController::class)->prefix('login')->group(function(){
    Route::post('authenticate', 'authenticate');
    Route::post('signup', 'signup');
});

Route::middleware('auth:sanctum')->controller(ProductController::class)->prefix('product')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::controller(BatchController::class)->prefix('batch')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::controller(AddressController::class)->prefix('address')->group(function(){
    Route::get('/showState', 'showState');
    Route::get('/showCity/{UF}', 'showCity');
    Route::get('/showNeighborhood/{city}', 'showNeighborhood');

    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

/*Route::controller(RegisterController::class)->prefix('register')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});*/

Route::any('*', function(){
    return response()->json([],404);
    //abort(404);
});