<?php

namespace App\Http\Controllers;

use App\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionsController extends Controller
{
    public function get_questions($id = null, $selects = 'content-questions.id')
    {
        if (!$id OR $id == "null") $id = Auth::user()->id;
        if (!$selects OR $selects == "null") $selects = 'content-questions.id';
        
        $selects = htmlspecialchars(strip_tags(($selects)));

        $questions = Question::query()
            ->select(explode('-', $selects))
            ->selectRaw('answers.answer')
            ->join('answers', 'answers.question_id', '=', 'questions.id', 'left')
            ->orderBy('id', 'desc')
            ->where('to_user_id', $id)
            ->get();

        return $questions->toJson();
    }
}
