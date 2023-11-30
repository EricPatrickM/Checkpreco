<?php

namespace App\Http\Controllers;

use App\Models\Stablishment;
use App\Http\Requests\AllStablishmentControllerRequest;

class StablishmentController extends Controller
{
    public function create(AllStablishmentControllerRequest $request){
        $data = $request->validated();
        return $data;
        $stablishment = Stablishment::create($data);
        
        if(! $stablishment){
            return response()->json([], 500);
        }
        return response()->json([], 201);
    }

    public function show(){
        $stablishment = Stablishment::orderBy('name')->paginate(10);
        return response()->json($stablishment);
    }
    
    public function delete($id){
        Stablishment::findOrFail($id)->delete();
        return response()->json([], 204);
    }
    

    public function update($id, AllStablishmentControllerRequest $request){
        $data = $request->validated();
        $stablishment = Stablishment::findOrFail($id)->update($data);
        if ($stablishment == 0) {
            return response()->json(['errors' => 'Nenhum item encontrado'], 404);
        }
        return response()->json([], 204);
    }
}
