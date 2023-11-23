<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Batch;

class BatchController extends Controller
{
    public function create(Request $request){
        $data = $request->json()->all();
        $validator = validator($data, [
            'batchDate' => 'required|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $batch = new Batch;
        $batch->batchDate = $data['batchDate'];
        $batch->save();

        return response("",201);
    }

    public function show(Request $request){
        $page = $request->query('page');

        $validator = validator(['page' => $page],[
            'page'  => 'bail|required|numeric',
        ]);

        if($validator->fails()) {
            return response()->json(['errors' => ['page' => ['page query is required.']]], 400);
        }

        $batch = Batch::paginate(10);
        return response()->json($batch);
    }

    public function delete($id){
        $validator = validator(['id' => $id], [
            'id'  => 'bail|required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $product = Product::where('id', '=', $id)->delete();
        if ($product == 0) {
            return response()->json(['errors' => 'Nenhum item encontrado'], 404);
        }
        return response('', 200);
    }

    public function update($id, Request $request){
        $data = $request->json()->all();
        $validator = validator($data + ['id' => $id], [
            'batchDate' => 'required|max:255',
            'id'  => 'bail|required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $batch = Batch::where('id','=', $id)->update(
            ['batchDate' => $data['batchDate']],
        );

        if ($batch == 0) {
            return response()->json(['errors' => 'Nenhum item encontrado'], 404);
        }

        return response("",201);
    }
}
