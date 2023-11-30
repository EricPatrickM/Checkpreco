<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Batch\createBatchControllerRequest;

use App\Models\Batch;

class BatchController extends Controller
{
    public function create(createBatchControllerRequest $request){
        $data = $request->validated();
        $batch = Batch::create($data);
        
        if($batch){
            return response()->json([], 500);
        }
        return response()->json([], 200);
    }

    public function show(){
        $batch = Batch::orderBy('created_at', 'desc')->paginate(10);
        return response()->json($batch);
    }

    public function delete($id){
        $product = Batch::findOrFail($id)->delete();
        if(! $product){
            return response()->json([], 404);
        }
        return response()->json([], 204);
    }

    public function update($id, createBatchControllerRequest $request){
        $data = $request->validated();
        $batch = Batch::findOrFail($id)->update($data);
        if ($batch == 0) {
            return response()->json(['errors' => 'Nenhum item encontrado'], 404);
        }
        return response()->json([],200);
    }
}
