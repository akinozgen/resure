<?php

use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\User::class, 500)->create();
        factory(\App\Question::class, 10000)->create();
        factory(\App\Answer::class, 1000)->create();
        factory(\App\Follow::class, 10000)->create();
    }
}
