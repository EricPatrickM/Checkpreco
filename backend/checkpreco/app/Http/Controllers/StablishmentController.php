<?php

namespace App\Http\Controllers;

use App\Models\Stablishment;
use App\Models\Allowed;
use App\Http\Requests\AllStablishmentControllerRequest;
use App\Http\Resources\stablishment\StablishmentResource;
use Illuminate\Support\Facades\Auth;

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
        if(Auth::user()->type=='admin'){
            $stablishment = Stablishment::
            ->where('stablishments.fk_stablishment_types_id', $id)
            ->orderBy('stablishments.name')
            ->paginate(6);
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
