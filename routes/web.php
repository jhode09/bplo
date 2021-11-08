<?php

use Illuminate\Support\Facades\Route;

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

Route::redirect('/', '/login')->name('user.login');

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('/taxpayer')->group(function () {
    Route::get('/dashboard', function () {
        return view('user/taxpayer.dashboard');
    });
    Route::get('/mybusiness', function () {
        return view('user/taxpayer.mybusiness');
    });
    Route::get('/tracking', function () {
        return view('user/taxpayer.tracking');
    });
    Route::get('/trans/payments', function () {
        return view('user/taxpayer.trans-payments');
    });
    Route::get('/trans/assessments', function () {
        return view('user/taxpayer.trans-assessments');
    });
});
