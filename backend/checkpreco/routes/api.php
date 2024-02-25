<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\StablishmentController;
use App\Http\Controllers\StablishmentTypeController;
use App\Http\Controllers\AllowedController;
use App\Http\Controllers\UserController;

Route::post('/login', [LoginController::class, 'authenticate']);

Route::middleware('auth:sanctum')
    ->controller(StablishmentTypeController::class)
    ->prefix('stablishmentType')->group(function () {
        Route::get('', 'show');
        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
        Route::middleware('AdminOnly')->put('/{id}', 'update');
    });

Route::middleware('auth:sanctum')
    ->controller(StablishmentController::class)
    ->prefix('stablishment')->group(function () {
        Route::get('/{stablishmentType}', 'show');
        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
        Route::middleware('AdminOnly')->put('/{id}', 'update');
    });

Route::middleware('auth:sanctum')
    ->controller(BatchController::class)
    ->prefix('batch')->group(function () {
        Route::get('/{stablishmentTypeId}', 'show');
        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
        Route::middleware('AdminOnly')->put('/{stablishmentId}', 'update');
    });

Route::middleware(['auth:sanctum'])
    ->controller(AddressController::class)->prefix('address')
    ->group(function () {
        Route::get('/search/city/{city}', 'searchCity');
        Route::get('/search/neighborhood/{city}', 'showNeighborhood');
        Route::get('/search/neighborhood/{city}/{neighborhood}', 'searchNeighborhood');
        Route::get('/search/state', 'showState');
        Route::get('/search/state/{UF}', 'searchUF');
        Route::get('/search/{id}', 'showById');

        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
    });

Route::middleware('auth:sanctum')
    ->controller(ProductController::class)
    ->prefix('product')->group(function () {
        Route::get('/search/{id}', 'searchBarCode');
        Route::get('/{stablishmentid}', 'show');

        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
        Route::middleware('AdminOnly')->put('/{id}', 'update');
    });

Route::middleware(['auth:sanctum', 'AdminOnly'])
    ->controller(AllowedController::class)
    ->prefix('allowed')->group(function () {
        Route::get('', 'show');
        Route::post('', 'create');
        Route::delete('/{id}', 'delete');
    });

Route::middleware(['auth:sanctum'])
    ->controller(UserController::class)
    ->prefix('users')->group(function () {
        Route::get('', 'show');
        Route::middleware('AdminOnly')->post('', 'create');
        Route::middleware('AdminOnly')->delete('/{id}', 'delete');
        Route::middleware('AdminOnly')->put('/{id}', 'update');
    });

Route::middleware('auth:sanctum')
    ->controller(RegisterController::class)
    ->prefix('register')->group(function () {
        Route::get('/{stab}/{batch}', 'show');
        Route::get('/history/{stab}/{prod}', 'showProductHistoric');

        Route::put('/{id}', 'update');
    });

#Registro de login para acompanhar as horas
