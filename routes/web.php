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

Route::group(['prefix' => 'api'], function () {

    Route::get('get_questions/{id}/{selects?}', 'QuestionsController@get_questions');
    Route::get('get_user/{username}', 'QuestionsController@get_user');
    Route::get('get_followers/{username}', 'QuestionsController@get_followers');
    Route::get('get_followings/{username}', 'QuestionsController@get_followings');
    Route::get('get_latest_users', 'QuestionsController@get_latest_users');
    Route::post('send_answer', 'QuestionsController@send_answer');
    Route::post('send_question', 'QuestionsController@send_question');
    Route::post('follow/{username}', 'QuestionsController@follow');
    Route::post('set_user_id', 'QuestionsController@set_user_id');

});

Route::get('/{path?}/{path2?}/{path3?}/{path4?}', function () {
  return view('reactroot');
})->name('react_root');
