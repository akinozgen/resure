<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $deleted_at
 * @property string $answer
 * @property int $question_id
 * @property string $image_url
 * @property string $created_at
 * @property string $updated_at
 */
class Answer extends Model
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
    protected $fillable = ['deleted_at', 'answer', 'question_id', 'image_url', 'created_at', 'updated_at'];

}
