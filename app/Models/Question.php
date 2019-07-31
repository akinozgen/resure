<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**'to_user_id'
 * @property integer $id
 * @property string $content
 * @property int $to_user_id
 * @property int $from_user_id
 * @property int $question_id
 * @property int $rating
 * @property string $deleted_at
 * @property string $created_at
 * @property string $updated_at
 */
class Question extends Model
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
    protected $fillable = ['content', 'to_user_id', 'from_user_id', 'question_id', 'rating', 'deleted_at', 'created_at', 'updated_at'];

}
