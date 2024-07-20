<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'defaultCategories']);
    Route::get('/user', [CategoryController::class, 'userCategories']);
});

Route::prefix('users')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
       Route::get('/', [UserController::class, 'index']);
       Route::post('/logout', [UserController::class, 'logout']);
    });
});

Route::prefix('transactions')->group(function () {
    Route::get('/', [TransactionController::class, 'list']);
    Route::get('/{id}', [TransactionController::class, 'show']);
    Route::get('/by-category/{category_id}', [TransactionController::class, 'byCategory']);

    Route::post('/', [TransactionController::class, 'store']);
    Route::put('/{id}', [TransactionController::class, 'update']);
    Route::delete('/{id}', [TransactionController::class, 'delete']);
});


