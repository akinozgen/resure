<?php

namespace App\Http\Controllers;

use App\Question;
use App\User;
use GuzzleHttp\Psr7\Response;
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
            ->orderBy('questions.id', 'desc')
            ->where('to_user_id', $id)
            ->get();

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
}
