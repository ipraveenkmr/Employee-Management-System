<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeDetailsController;
use App\Http\Controllers\AccountDetailsController;
use App\Http\Controllers\ReferenceDetailsController;
use App\Http\Controllers\OffboardingDetailsController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'index']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::apiResource('employees', EmployeeDetailsController::class);
Route::apiResource('employee-accounts', AccountDetailsController::class)->only(['index', 'store', 'update']);
Route::apiResource('employee-references', ReferenceDetailsController::class)->only(['index', 'store', 'update', 'destroy']);
Route::apiResource('employee-offboardings', OffboardingDetailsController::class)->only(['index', 'store', 'update']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
