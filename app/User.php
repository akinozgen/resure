<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'twitter_token', 'bio', 'pp_url', 'banner_url', 'username', 'provider', 'provider_id', 'twitter_data'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function getFollowersCount($user_id)
    {
        return Follow::query()
            ->where('following_user_id', $user_id)
            ->count('id');
    }

    public static function getFollowingCount($user_id)
    {
        return Follow::query()
            ->where('follower_user_id', $user_id)
            ->count('id');
    }

}
