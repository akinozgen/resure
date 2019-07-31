<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Question;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class QuestionsController extends Controller
{
    public function get_questions($id = null, $selects = 'content-questions.id-questions.created_at')
    {
        if (!$id OR $id == "null") $id = Auth::user()->id;
        if (!$selects OR $selects == "null") $selects = 'content-questions.id-questions.created_at';
        
        $selects = htmlspecialchars(strip_tags(($selects)));

        $questions = Question::query()
            ->select(explode('-', $selects))
            ->selectRaw('answers.answer')
            ->join('answers', 'answers.question_id', '=', 'questions.id', 'left')
            ->orderBy('questions.created_at', 'desc')
            ->where('to_user_id', $id)
            ->groupBy('questions.id')
            ->get()
            ->map(function (Question $question) {
                $question->asked_at = Carbon::parse($question->created_at)->diffForHumans(Carbon::now());
                return $question;
            });

        return $questions->toJson();
    }
    
    public function get_user($username = null)
    {
        if (!$username) return new Response(404, [], ['error' => 'User not found.']);
        
        $user = User::query()
            ->select(['id', 'username', 'banner_url', 'bio', 'email', 'name', 'pp_url'])
            ->where('username', $username)
            ->get()
            ->first();
        
        if (!$user)return new Response(404, [], ['error' => 'User not found.']);
        
        $questions = Question::query()
            ->select('content')
            ->selectRaw('answers.answer')
            ->join('answers', 'answers.question_id', '=', 'questions.id', 'inner')
            ->orderBy('questions.id', 'desc')
            ->where('questions.to_user_id', $user->id)
            ->get();

        $user->id = null;
        $user->questions = $questions;
        /** @var User $user */
        
        return collect($user->getAttributes())->filter(function ($x) {
            return $x ? true : false;
        });
    }
    
    public function get_latest_users()
    {
        $users = User::query()
            ->select(['pp_url', 'username', 'name'])
            ->orderBy('id', 'desc')
            ->take(10)
            ->get();
        
        return $users;
    }
    
    public function send_answer()
    {
        $question_id = request('id');
        $answer_text = request('answer');
        
        $question = Question::query()->where('id', $question_id)->get();
        
        if ($question->count() == 0) return new Response(['status' => 'error', 'message' => 'Question not found!'], 404);
        $question = $question->first();
        
        if ($question->to_user_id != auth()->user()->id) return new Response(['status' => 'error', 'message' => 'This question doesn\'t belong to you >:('], 503);
        
        $answer = new Answer([
            'answer' => $answer_text,
            'question_id' => $question_id
        ]);
        
        $save = $answer->saveOrFail();
        return new Response(
            [
                'status' => $save ? 'success' : 'error',
                'message' => $save ? 'Your answer has been saved.' : 'We couldn\'t manage to save your answer. Try again later.'
            ],
            $save ? 200 : 500
        );
    }
}