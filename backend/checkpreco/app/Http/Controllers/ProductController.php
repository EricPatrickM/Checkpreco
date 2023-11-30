<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Product;

use App\Http\Requests\Product\createProductControllerRequest;
use App\Http\Requests\Product\updateProductControllerRequest;

use App\Http\Resources\ProductResource;


class ProductController extends Controller
{
    public function create(createProductControllerRequest $request) {
        $data = $request->validated();
        $user = Product::create($data);

        if($user){
            return response()->json([], 201);
        }
        return(response()->json([], 500));
    }



    public function show() {
        $product = Product::paginate(10);
        $product->data = ProductResource::collection($product);
        return $product;
    }

    public function delete($id) {
        Product::findOrFail($id)->delete();
        return response()->json([], 204);
    }

    public function update($id, updateProductControllerRequest $request) {
        $data = $request->validated();

        $product = Product::findOrFail($id)->update($data);

        return response()->json([], 201);
    }
}
