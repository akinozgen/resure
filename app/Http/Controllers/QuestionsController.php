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

        if (!$id or $id == "null") $id = Auth::user()->id;
        if (!$selects or $selects == "null") $selects = 'content-questions.id-questions.created_at';

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
            ->selectRaw('answers.answer, answers.created_at as answered_at, questions.from_user_id, questions.anon')
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

                if ($question->anon == 0) {
                    /** @var User $asked_by */
                    $asked_by = User::find($question->from_user_id);

                    if ($asked_by instanceof User) {
                        $question->asked_by = [
                            "username" => $asked_by->username,
                            "profile_picture" => $asked_by->pp_url
                        ];
                    }
                }

                unset($question->from_user_id);

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
            ->select(['id', 'username', 'banner_url', 'bio', 'email', 'name', 'pp_url', 'private', 'only_anons', 'show_twitter'])
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
            ->join('answers', 'answers.question_id', '=', 'questions.id', 'inner')
            ->where('questions.to_user_id', $user->id)
            ->distinct()
            ->first()
            ->total;

        $isFollowed = Follow::query()
            ->where('follower_user_id', auth()->user()->id)
            ->where('following_user_id', $user->id)
            ->first();

        $isFollowing = Follow::query()
            ->where('following_user_id', $user->id)
            ->where('follower_user_id', auth()->user()->id)
            ->first();

        $user->is_followed = (bool)$isFollowed;
        $user->is_following = (bool)$isFollowing;
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
            ->select(['pp_url', 'username', 'name', 'created_at'])
            ->where('private', 0)
            ->orderBy('id', 'desc')
            ->take(10)
            ->get();

        $users = $users->map(function (User $user) {
            $user->isNew = false;
            $diff = Carbon::now()->timestamp - Carbon::parse($user->created_at)->timestamp;
            if ($diff <= 86400) {
                $user->isNew = true;
            }
            return $user;
        });

        return new Response($users, 200, ['Content-type' => 'application/json']);
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
        if (!($to_user instanceof User)) return new Response([
            'status' => Responses::ERROR,
            'message' => Responses::USER_NOT_FOUND
        ], Responses::STATUS_NOT_FOUND);

        $question_content = request('question_content');
        $to_user_id = $to_user->id;
        $from_user_id = auth()->user()->id;
        $is_anon = (bool)request('is_anon');

        if (auth()->user()->id == $to_user_id) return new Response([
            'status' => Responses::ERROR,
            'message' => Responses::CANT_ASK_YOURSELF
        ], Responses::STATUS_ERR_AUTH);

        $question = new Question([
            'content' => $question_content,
            'to_user_id' => $to_user_id,
            'from_user_id' => $from_user_id,
            'anon' => $is_anon
        ]);

        $save = $question->save();

        return new Response([
            'status' => $save ? Responses::SUCCESS : Responses::ERROR,
            'message' => $save ? Responses::QUESTION_SENT : Responses::QUESTION_NOT_SEND
        ], $save ? Responses::STATUS_OK : Responses::STATUS_ERR);
    }

    public function get_followers($username = null)
    {
        sleep(1);
        if (!$username) return new Response(404, [], ['error' => 'User not found.']);
        $user = User::query()
            ->where('username', $username)
            ->first();
        if (!$user) return new Response(404, [], ['error' => 'User not found.']);

        $followers = Follow::query()
            ->where('following_user_id', $user->id)
            ->with('follower')
            ->offset(request('start'))
            ->limit(request('length'))
            ->orderBy('created_at', 'desc')
            ->get();

        $total_followers = Follow::query()
            ->selectRaw("count('id') as total")
            ->where('following_user_id', $user->id)
            ->first();

        return [
            'total_followers' => $total_followers['total'],
            'followers' => $followers->map(function (Follow $follow) {
                $follower = $follow->follower;
                return [
                    'username' => $follower->username,
                    'profile_pic_url' => $follower->pp_url,
                    'name' => $follower->name,
                    'bio' => $follower->bio
                ];
            })
        ];
    }
    public function get_followings($username = null)
    {
        sleep(1);
        if (!$username) return new Response(404, [], ['error' => 'User not found.']);
        $user = User::query()
            ->where('username', $username)
            ->first();
        if (!$user) return new Response(404, [], ['error' => 'User not found.']);

        $followers = Follow::query()
            ->where('follower_user_id', $user->id)
            ->with('following')
            ->offset(request('start'))
            ->limit(request('length'))
            ->orderBy('created_at', 'desc')
            ->get();

        $total_followers = Follow::query()
            ->selectRaw("count('id') as total")
            ->where('follower_user_id', $user->id)
            ->first();

        return [
            'total_followings' => $total_followers['total'],
            'followings' => $followers->map(function (Follow $follow) {
                $follower = $follow->following;
                return [
                    'username' => $follower->username,
                    'profile_pic_url' => $follower->pp_url,
                    'name' => $follower->name,
                    'bio' => $follower->bio
                ];
            })
        ];
    }

    public function follow(Request $request, $username)
    {
        sleep(1);
        if (!$username) return new Response(404, [], ['error' => 'User not found.']);
        if (!$request->has('follow')) return new Response(404, [], ['error' => 'Can\'t follow.']);
        $user = User::query()
            ->where('username', $username)
            ->first();
        if (!$user) return new Response(404, [], ['error' => 'User not found.']);

        if ($request->follow == 'false') {
            $follows = Follow::query()
                ->where('follower_user_id', \auth()->user()->id)
                ->where('following_user_id', $user->id)
                ->get();

            $op = @$follows->map(function ($follow) {
                return $follow->delete();
            })->reduce(function ($x, $y) {
                return $x && $y;
            }, true);
        } else {
            $follow = new Follow();
            $follow->follower_user_id = \auth()->user()->id;
            $follow->following_user_id = $user->id;
            $op = @$follow->save();
        }

        return [
            'status' => @$op ? 'success' : 'error'
        ];
    }
}
