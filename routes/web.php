<?php

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

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', function () {
    return view('reactroot');
})->name('react_root');


Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('auth/callback/{provider}', 'SocialAuthController@callback');
Route::get('auth/redirect/{provider}', 'SocialAuthController@redirect');

/*
Route::group(['middleware' => ['auth']], function () {
    Route::get('/settings', 'HomeController@settings')->name('settings');
    Route::get('/profile', 'HomeController@profile')->name('profile');
    Route::post('/profile', 'HomeController@profile_save_post')->name('profile_save_post');
});
*/

Route::group(['prefix' => 'auth'], function () {
    
    Route::get('/check_twitter_auth', 'AuthController@checkAuth');
    Route::get('/perform_logout', 'AuthController@perform_logout');
    
});