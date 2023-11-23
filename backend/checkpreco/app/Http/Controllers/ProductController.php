<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Product;

use App\Http\Requests\Product\createProductControllerRequest;
use App\Http\Requests\Product\updateProductControllerRequest;

use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function create(createProductControllerRequest $request/*, $changedBy="Admin"*/) {
        $data = $request->validated();
        $data['changedBy'] = "ERIC";

        $user = Product::create($data);

        if($user){
            return response()->json([], 201);
        }
        return(response()->json([], 500));
    }



    public function show(Request $request) {
        $product = Product::paginate(10);
        return ProductResource::collection($product);
    }



    public function delete($id) {
        Product::findOrFail($id)->delete();
        return response()->json([],204);
    }



    public function update($id, updateProductControllerRequest $request) {
        $data = $request->validated();
        $data['changedBy'] = "ERICP";

        $product = Product::findOrFail($id)->update($data);

        return response()->json([], 201);
    }
}
