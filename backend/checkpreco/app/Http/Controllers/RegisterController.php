<?php

namespace App\Http\Controllers;

use App\Models\Register;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function create(Request $request, $id) {
        $request -> validate([
            'price' => 'bail|required|numeric|regex:/^(\d{1,5}}(\.\d{1,2})?)?$/',
        ]);
    }



    public function show(Request $request) {
        return '5';
    }



    public function delete($id) {
        return '5';
    }



    public function update($id, Request $request) {
        return '5';
    }
}
