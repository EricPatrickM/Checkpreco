<?php

namespace App\Http\Controllers;

use App\Http\Requests\Batch\createBatchControllerRequest;

use App\Models\Batch;
use Exception;

class BatchController extends Controller
{
    public function create(createBatchControllerRequest $request){
        $data = $request->validated();
        $batch = Batch::create($data);

        if($batch){
            return response()->json([], 201);
        }
        return response()->json([], 500);
    }

    public function show($id){
        $batch = Batch::where('fk_stablishment_types_id', $id)->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($batch, 200);
    }

    public function delete($id){
        try{
            Batch::findOrFail($id)->delete();
            return response()->json([], 204);
        } catch(Exception $e){
            return response()->json([], 500); 
        }
    }

    public function update($id, createBatchControllerRequest $request){
        try{
            $data = $request->validated();
            $batch = Batch::findOrFail($id)->update($data);
            if ($batch != 0) {
                return response()->json([],200);
            }
            return response()->json([], 404);
        } catch(Exception $e){
            return response()->json([], 500);
        }
    }
}
