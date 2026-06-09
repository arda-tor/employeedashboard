<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeSocialBenefitController;
use App\Http\Controllers\SocialBenefitController;

Route::apiResource('employees', EmployeeController::class);
Route::apiResource('social-benefits', SocialBenefitController::class);
Route::apiResource('employee-social-benefits', EmployeeSocialBenefitController::class);
