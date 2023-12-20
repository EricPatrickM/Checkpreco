<?php

namespace App\Http\Controllers;

use App\Models\Stablishment;
use App\Http\Requests\AllStablishmentControllerRequest;
use App\Http\Resources\stablishment\StablishmentResource;

class StablishmentController extends Controller
{
    public function create(AllStablishmentControllerRequest $request){
        $data = $request->validated();
        $stablishment = Stablishment::create($data);
        
        if($stablishment){
            return response()->json([], 201);
        }
        return response()->json([], 500);
    }
    
    public function show($id){
        $stablishment = Stablishment::where('fk_stablishment_types_id', $id)->orderBy('name')->paginate(10);
        return response()->json($stablishment, 200);
    }
    
    public function delete($id){
        Stablishment::findOrFail($id)->delete();
        return response()->json([], 204);
    }
    
    public function update($id, AllStablishmentControllerRequest $request){
        $data = $request->validated();
        Stablishment::findOrFail($id)->update($data);
        return response()->json([], 204);
    }
}
