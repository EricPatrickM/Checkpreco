<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\StablishmentController;
use App\Http\Controllers\StablishmentTypeController;

Route::prefix('login')->group(function() {
    Route::post('/authenticate', [LoginController::class, 'authenticate']);
    Route::middleware('auth:sanctum')->post('/signup', [LoginController::class, 'signup']);
});

Route::middleware('auth:sanctum')->controller(ProductController::class)->prefix('product')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::middleware('auth:sanctum')->controller(BatchController::class)->prefix('batch')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::middleware('auth:sanctum')->controller(AddressController::class)->prefix('address')->group(function(){
    Route::get('/showState', 'showState');
    Route::get('/showCity/{UF}', 'showCity');
    Route::get('/showNeighborhood/{city}', 'showNeighborhood');
    
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
});

Route::/*middleware('auth:sanctum')->*/controller(StablishmentTypeController::class)->prefix('stablishmentType')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::/*middleware('auth:sanctum')->*/controller(StablishmentController::class)->prefix('stablishment')->group(function(){
    Route::get('', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::/*middleware('auth:sanctum')->*/controller(RegisterController::class)->prefix('register')->group(function(){
    Route::get('/{id}', 'show');
    Route::post('', 'create');
    Route::delete('/{id}', 'delete');
    Route::put('/{id}', 'update');
});

Route::any('*', function(){
    return response()->json([],404);
    //abort(404);
});