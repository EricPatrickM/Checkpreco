<?php

namespace App\Http\Controllers;

use App\Http\Requests\AllStablishmentTypeControllerRequest;
use App\Models\StablishmentType;

class StablishmentTypeController extends Controller
{
    public function create(AllStablishmentTypeControllerRequest $request){
        $data = $request->validated();
        $stablishment = StablishmentType::create($data);
        
        if(! $stablishment){
            return response()->json([], 400);
        }
        return response()->json([], 201);
    }

    public function show(){
        $stablishment = StablishmentType::orderBy('name')->paginate(15);
        return response()->json($stablishment, 200);
    }
    
    public function delete($id){
        StablishmentType::findOrFail($id)->delete();
        return response()->json([], 204);
    }
    

    public function update($id, AllStablishmentTypeControllerRequest $request){
        $data = $request->validated();
        $stablishment = StablishmentType::findOrFail($id)->update($data);
        
        if ($stablishment == 0) {
            return response()->json([], 404);
        }
        return response()->json([], 204);
    }
}
