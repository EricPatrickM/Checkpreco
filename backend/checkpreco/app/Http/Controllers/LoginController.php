<?php

namespace App\Http\Controllers;

use App\Http\Requests\signupLoginControllerRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function authenticate(Request $request){
        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)){
            throw ValidationException::withMessages([
                'credentials'=>'invalid!'
            ]);
        }
        //return response()->json($user->email);
        $token = $user->createToken($user->email)->plainTextToken;
 
        return response()->json(['token' => $token], 200);
    }

    public function signup(signupLoginControllerRequest $request){
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return response()->json($user,201);
    }
}
