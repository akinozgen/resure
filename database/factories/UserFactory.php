<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */
use App\User;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'email_verified_at' => now(),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'username' => $faker->userName,
        'pp_url' => $faker->imageUrl(400, 400),
        'banner_url' => $faker->imageUrl(1200, 500),
        'bio' => $faker->realText(100),
        'provider' => 'twitter',
        'provider_id' => $faker->uuid,
        'twitter_data' => null,
        'twitter_token' => $faker->linuxPlatformToken,
        'remember_token' => Str::random(10)
    ];
});

$factory->define(\App\Question::class, function (Faker $faker) {
    
    $users = User::query()->select('id')->get()->toArray();
    $questions = \App\Question::query()->select('id')->get()->toArray();
    
    return [
        'content' => $faker->realText(50),
        'to_user_id' => $users[rand(0, count($users) - 1)]['id'],
        'from_user_id' => $users[rand(0, count($users) - 1)]['id'],
        'question_id' => count($questions) > 0 ?  $questions[rand(0, count($questions) - 1)]['id'] : null,
        'rating' => rand(0, 10)
    ];
    
});

$factory->define(\App\Answer::class, function (Faker $faker) {
    
    $users = User::query()->select('id')->get()->toArray();
    $questions = \App\Question::query()->select('id')->get()->toArray();
    
    return [
        'answer' => $faker->text(rand(20, 50)),
        'question_id' => $questions[ rand(0, count($questions) - 1) ]['id'],
        'image_url' => rand(0, 100) >= 75 ? $faker->imageUrl(300, 300) : null
    ];
});

$factory->define(\App\Follow::class, function (Faker $faker) {
    $users = User::query()->select('id')->get()->toArray();
    
    $follower_id = $users[rand(0, count($users) - 1)]['id'];
    $followed_id = $users[rand(0, count($users) - 1)]['id'];
    
    if ($followed_id == $follower_id) {
        $followed_id = $users[rand(0, count($users) - 1)]['id'];
    }
    
    return [
        'follower_user_id' => $follower_id,
        'following_user_id' => $followed_id
    ];
});