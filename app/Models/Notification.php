<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property int $to_user_id
 * @property int $from_user_id
 * @property string $type
 * @property int $related_to_id
 * @property string $deleted_at
 * @property string $created_at
 * @property string $updated_at
 */
class Notification extends Model
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
    protected $fillable = ['to_user_id', 'from_user_id', 'type', 'related_to_id', 'deleted_at', 'created_at', 'updated_at'];

}
