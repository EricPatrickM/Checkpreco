<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use App\Models\User;

use App\Http\Requests\User\signupLoginControllerRequest;
use App\Http\Requests\User\authenticateLoginControllerRequest;

class LoginController extends Controller
{
    public function authenticate(authenticateLoginControllerRequest $request){
        $data = $request->validated();
        $user = User::where('email', $data['email'])->first();

        if(!$user || !Hash::check($data['password'], $user->password)){
            throw ValidationException::withMessages([
                'credentials'=>'invalid!'
            ]);
        }
        $token = $user->createToken($user->email)->plainTextToken;
 
        return response()->json(['token' => $token], 200);
    }
}