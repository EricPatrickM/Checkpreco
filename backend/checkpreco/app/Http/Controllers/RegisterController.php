<?php

namespace App\Http\Controllers;

use App\Models\Register;
use App\Models\Product;
use Illuminate\Http\Request;

use App\Http\Requests\AllRegisterControllerRequest;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function show($stab, $batch)
    {
        $data = Register::where('fk_stablishments_id', $stab)
            ->where('fk_batchs_id', $batch)
            ->paginate(10);
        return response()->json($data, 200);
    }

    public function showProductHistoric($stab, $prod)
    {
        $data = Register::where('fk_stablishments_id', $stab)
            ->where('fk_products_id', $prod)
            ->take(3)
            ->get();
        return response()->json($data, 200);
    }

    public function update($id, Request $request)
    {
        $data = $request->validate([
            'price' => ['required', 'regex:/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/'],
        ]);

        $register = Register::findOrFail($id);
        $register->fk_user_id = Auth::user()->id;
        $register->price = $data['price'];
        $register->save();
        return response()->json([], 200);
    }
}
