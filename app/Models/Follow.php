<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property int $follower_user_id
 * @property int $following_user_id
 * @property string $created_at
 * @property string $updated_at
 */
class Follow extends Model
{
    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['follower_user_id', 'following_user_id', 'created_at', 'updated_at'];

    public function following()
    {
        return $this->hasOne(User::class, 'id', 'following_user_id');
    }

    public function follower()
    {
        return $this->hasOne(User::class, 'id', 'follower_user_id');
    }

}
