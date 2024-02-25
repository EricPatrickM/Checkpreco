<?php

namespace App\Http\Controllers;

use App\Http\Requests\AllUserControllerRequest;
use App\Models\User;

class UserController extends Controller
{
    public function create(AllUserControllerRequest $request) {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);
        if($user){
            return response()->json([], 201);
        }
        return(response()->json([], 500));
    }

    public function show() {
        $users = User::all();
        return response()->json($users, 200);
    }    


    public function delete($id) {
        User::findOrFail($id)->delete();
        return response()->json([], 204);
    }

    public function update($id, AllUserControllerRequest $request) {
        $data=$request->validated();
        $data['password'] = bcrypt($data['password']);
        User::findOrFail($id)->update($data);
        return response()->json([],204);
    }
}
