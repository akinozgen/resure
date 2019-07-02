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
                $response->setContent([
                    'status' => true,
                    'user' => auth()->user(),
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
