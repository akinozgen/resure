<?php

    namespace App\Http\Controllers;

    use App\User;
    use Illuminate\Http\Request;
    use Illuminate\Http\Response;

    class AuthController extends Controller
    {
        public function checkAuth(Request $request)
        {
            // TODO: IP Control
            $response = new Response();

            if (auth()->check()) {
                $user = auth()->user();
                $user->followers_count = User::getFollowersCount($user->id);
                $user->following_count = User::getFollowingCount($user->id);
                $user = $user->toArray();
                unset($user['twitter_data']);
                $response->setContent([
                    'status' => true,
                    'user' => $user,
                    'token' => auth()->user()->getRememberToken()
                ]);
            } else {
                $response->setContent([
                    'status' => false
                ]);
            }

            return $response;
        }

        public function perform_logout() {
            auth()->logout();
        }
    }
