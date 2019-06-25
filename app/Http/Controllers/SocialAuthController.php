<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Contracts\Provider;
use App\User;
use Illuminate\Support\Facades\Auth as AuthFacade;
use Illuminate\Support\Facades\Hash;

class SocialAuthController extends Controller
{
    public function callback($provider)
    {
        $user = $this->createOrGetUser(Socialite::driver($provider));
        auth()->login($user);
        
        return redirect()->route('profile');
    }
    
    private function createOrGetUser(Provider $provider)
    {
        $providerUser = $provider->user();
        $providerName = class_basename($provider);

        $user = User::query()
            ->where('provider', $providerName)
            ->where('provider_id', $providerUser->getId())
            ->first();

        if (!$user) {
            $user = User::create([
                'name' => $providerUser->getName(),
                'username' => $providerUser->getNickname(),
                'email' => $providerUser->getEmail(),
                'provider_id' => $providerUser->getId(),
                'provider' => $providerName,
                'twitter_token' => $providerUser->token,
                'pp_url' => $providerUser->user['profile_image_url'],
                'banner_url' => $providerUser->user['profile_banner_url'],
                'bio' => $providerUser->user['description'],
                'twitter_data' => json_encode($providerUser->user, JSON_PRETTY_PRINT)
            ]);
        }
        
        return $user;
    }
    
    public function logout(Request $request)
    {
        AuthFacade::logout();
        return redirect()->route('home');
    }
    
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }
}