<?php

namespace App\Http\Controllers;

use App\Answer;
use App\Enums\Responses;
use App\Follow;
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
        if (!auth()->check()) return new Response([
            'status' => Responses::ERROR,
            'message' => Responses::NOT_LOGGED_IN_FOR_QUESTIONS
        ], Responses::STATUS_ERR_AUTH);
        
        if (!$id OR $id == "null") $id = Auth::user()->id;
        if (!$selects OR $selects == "null") $selects = 'content-questions.id-questions.created_at';
        
        if (intval($id) == 0) {
            $id = User::query()->where('username', $id)->first()->id;
            $answeredOnly = true;
        }
        
        $selects = htmlspecialchars(strip_tags(($selects)));
        
        $joinType = 'left';
        
        if (isset($answeredOnly)) {
            $joinType = 'inner';
        } else {
            $joinType = 'left';
        }
        
        $questions = Question::query()
            ->select(explode('-', $selects))
            ->selectRaw('answers.answer, answers.created_at as answered_at')
            ->join('answers', 'answers.question_id', '=', 'questions.id', $joinType)
            ->orderBy('questions.created_at', 'desc')
            ->where('to_user_id', $id)
            ->groupBy('questions.id');

        if (request('newOnly') == 'true' && !isset($answeredOnly)) {
            $questions = $questions->whereNull('answers.id');
        }
        
        $questions = $questions
            ->get()
            ->map(function (Question $question) {
                $question->asked_at = Carbon::parse($question->created_at)->diffForHumans(Carbon::now());
                
                if ($question->answer) {
                    $question->answered_at = Carbon::parse($question->answered_at)->diffForHumans(Carbon::now());
                }
                
                return $question;
            });
        
        return new Response([
            'status' => Responses::SUCCESS,
            'data' => $questions->toArray()
        ], Responses::STATUS_OK);
    }
    
    public function get_user($username = null)
    {
        if (!$username) return new Response(404, [], ['error' => 'User not found.']);
        
        $user = User::query()
            ->select(['id', 'username', 'banner_url', 'bio', 'email', 'name', 'pp_url'])
            ->where('username', $username)
            ->get()
            ->first();
        
        $followers = Follow::query()
            ->selectRaw('count(id) as total')
            ->where('following_user_id', $user->id)
            ->first()
            ->total;
        
        $followings = Follow::query()
            ->selectRaw('count(id) as total')
            ->where('follower_user_id', $user->id)
            ->first()
            ->total;
        
        $answereds = Question::query()
            ->selectRaw('count(questions.id) as total')
            ->join('answers', 'answers.question_id', '=', 'questions.id' ,'inner')
            ->where('questions.to_user_id', $user->id)
            ->distinct()
            ->first()
            ->total;
        
        $user->total_followers = $followers;
        $user->total_followings = $followings;
        $user->total_answered = $answereds;
        
        if (!$user) return new Response(404, [], ['error' => 'User not found.']);

        $user->id = null;
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
        
        if ($question->count() == 0) return new Response(['status' => Responses::ERROR, 'message' => Responses::QUESTION_NOT_FOUND], Responses::STATUS_NOT_FOUND);
        $question = $question->first();
        
        if ($question->to_user_id != auth()->user()->id) return new Response(['status' => Responses::ERROR, 'message' => Responses::NOT_USERS_QUESTION], Responses::STATUS_ERR_AUTH);
        
        $answer = new Answer([
            'answer' => $answer_text,
            'question_id' => $question_id
        ]);
        
        $save = $answer->save();
        return new Response(
            [
                'status' => $save ? Responses::SUCCESS : Responses::ERROR,
                'message' => $save ? Responses::SAVED : Responses::NOT_SAVED
            ],
            $save ? Responses::STATUS_OK : Responses::STATUS_ERR
        );
    }
    
    public function send_question()
    {
        $to_user = User::query()->where('username', request('to_user_id'))->first();
        if ( ! ($to_user instanceof User) ) return new Response([
            'status' => Responses::ERROR,
            'message' => Responses::USER_NOT_FOUND
        ], Responses::STATUS_NOT_FOUND);
        
        $question_content = request('question_content');
        $to_user_id = $to_user->id;
        $from_user_id = auth()->user()->id;
     
        if (auth()->user()->id == $to_user_id) return new Response([
            'status' => Responses::ERROR,
            'message' => Responses::CANT_ASK_YOURSELF
        ], Responses::STATUS_ERR_AUTH);
        
        $question = new Question([
            'content' => $question_content,
            'to_user_id' => $to_user_id,
            'from_user_id' => $from_user_id
        ]);
        
        $save = $question->save();
        
        return new Response([
            'status' => $save ? Responses::SUCCESS : Responses::ERROR,
            'message' => $save ? Responses::QUESTION_SENT : Responses::QUESTION_NOT_SEND
        ], $save ? Responses::STATUS_OK : Responses::STATUS_ERR);
    }
}
