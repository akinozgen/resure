<?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use Illuminate\Http\Response;

    class AuthController extends Controller
    {
        public function checkAuth(Request $request)
        {
            // TODO: IP Control
            $response = new Response();

            if (auth()->check()) {
                $user = auth()->user()->toArray();
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
