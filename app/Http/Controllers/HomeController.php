<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('home');
    }
    
    public function settings(Request $request)
    {
        $user = Auth::user()->toArray();
        
        return view('users.settings', [
            'user' => $user
        ]);
    }
    
    public function profile(Request $request)
    {
        $user = Auth::user()->toArray();
        
        return view('users.profile', [
            'user' => $user
        ]);
    }
}
