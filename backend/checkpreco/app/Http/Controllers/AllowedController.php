<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\AllAllowedControllerRequest;
use App\Models\Allowed;
use Exception;

class AllowedController extends Controller
{

    public function index(){
        $data = Allowed::paginate(6);
        return response()->json($data, 200);
    }
    
    public function create(AllAllowedControllerRequest $request){
        $data = $request->validated();
        if(Allowed::where('fk_stablishments_id', $data['fk_stablishments_id'])
            ->where('fk_users_id', $data['fk_users_id'])
        ->exists()){
            return response()->json([], 406);
        }
        $allow = Allowed::create($data);

        if($allow){
            return response()->json([], 201);
        }
        return response()->json([], 400);
    }

    public function show($id){
        $data = Allowed::where('id', $id)->paginate(6);
        return response()->json($data, 200);
    }

    public function delete($id){
        try{
            Allowed::findOrFail($id)->delete();
            return response()->json([], 204);
        } catch(Exception $e){
            return response()->json([], 500); 
        }
    }

}
