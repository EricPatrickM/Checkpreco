<?php

namespace App\Http\Controllers;

use App\Models\Register;
use App\Models\Product;
use Illuminate\Http\Request;

use App\Http\Requests\AllRegisterControllerRequest;

class RegisterController extends Controller
{
    public function create(AllRegisterControllerRequest $request) {
        $data = $request->validated();
        $products = Product::
            where('fk_stablishment_types_id', $data['fk_stablishment_types_id'])
        ->get();

        foreach($products as $j){
            Register::create([
                'fk_stablishment_types_id' => $data['fk_stablishment_types_id'],
                'fk_products_id' => $j['id'],
                'fk_batchs_id' => $data['fk_batchs_id'],
                'fk_users_id' => null,
                'price' => null,
            ]);
        }
        return response()->json([], 201);
    }

    public function show($type, $batch) {
        $data = Register::/*where('fk_stablishment_types_id', $type)
            ->where('fk_batchs_id', $batch)*/
            All();
        //->paginate(10);
        return response()->json($data, 200);
    }

    public function delete($id) {
        return '5';
    }

    public function update($id, Request $request) {
        return '5';
    }
}
