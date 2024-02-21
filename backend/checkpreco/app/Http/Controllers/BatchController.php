<?php

namespace App\Http\Controllers;

use App\Http\Requests\Batch\createBatchControllerRequest;

use App\Models\Batch;
use App\Models\Product;
use App\Models\Register;
use App\Models\Stablishment;
use Exception;

class BatchController extends Controller
{
    public function create(createBatchControllerRequest $request)
    {
        $data = $request->validated();
        $fk_stablishment_types_id = $data['fk_stablishment_types_id'];

        $batch = Batch::create($data);
        $products = Product::where('fk_stablishment_types_id', $fk_stablishment_types_id)->get();
        $stablishments = Stablishment::where('fk_stablishment_types_id', $fk_stablishment_types_id)->get();

        $qnt = 0;
        if ($batch && $products) {
            foreach ($stablishments as $stablishment) {
                foreach ($products as $product) {
                    $qnt += 1;
                    Register::create([
                        'price' => null,
                        'fk_products_id' => $product->id,
                        'fk_users_id' => 1,
                        'fk_stablishments_id' => $stablishment->id,
                        'fk_batchs_id' => $batch->id,
                    ]);
                }
            }
            return response()->json($qnt, 201);
        }
        return response()->json([], 500);
    }

    public function show($id)
    {
        $batch = Batch::where('fk_stablishment_types_id', $id)->orderBy('created_at', 'desc')->paginate(10);
        return response()->json($batch, 200);
    }

    public function delete($id)
    {
        Batch::findOrFail($id)->delete();
        Register::where('fk_batch_id', $id)->delete();
        return response()->json([], 204);
    }

    public function update($id, createBatchControllerRequest $request)
    {
        try {
            $data = $request->validated();
            $batch = Batch::findOrFail($id)->update($data);
            if ($batch != 0) {
                return response()->json([], 200);
            }
            return response()->json([], 404);
        } catch (Exception $e) {
            return response()->json([], 500);
        }
    }
}
