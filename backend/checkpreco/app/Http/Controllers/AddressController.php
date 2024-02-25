<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Address;

use App\Http\Requests\Address\createAddressControllerRequest;

class AddressController extends Controller
{
    public function searchCity($city){
        $data = Address::selectRaw('DISTINCT city')
            ->where('city', 'REGEXP', '^' . $city . '.*')
            ->take(10)
        ->get();
        return response()->json($data, 200);
    }

    public function searchNeighborhood($city, $neighborhood=""){
        $data = Address::select(['city', 'neighborhood', 'id'])
            ->where('city', $city)
            ->where('neighborhood', 'REGEXP', '^' . $neighborhood . '.*')
            ->limit(10)
        ->get();
        return response()->json($data, 200);
    }    
    
    public function searchUF($UF){
        $validator = validator(['UF' => $UF], [
            'UF'  => 'bail|required|max:2|min:2',
        ]);
        $UF=strtoupper($UF);

        $city = Address::select(['city'])->distinct()->where('state', $UF)->distinct()->get();
        return response()->json($city, 200);
    }

    public function showById($id){
        $city = Address::findOrFail($id);
        return response()->json($city, 200);
    }
    
    public function showState(){
        return response()->json(json_decode(file_get_contents(Storage::path('/public/neighborResume.json'))));
    }

    public function showNeighborhood($city){
        validator(['city' => $city], [
            'city'  => 'required|max:255|min:2',
        ]);

        $neighborhood = Address::select(['neighborhood', 'id'])->where('city', $city)->paginate(10);
        return response()->json($neighborhood);
    }

    public function create(createAddressControllerRequest $request){
        $data = $request->validated();

        $exists = Address::where('state', $data["state"])
            ->where('city', $data["city"])
            ->where('neighborhood', $data["neighborhood"])
            ->get()
        ->first();

        if($exists){
            abort(409);
        }

        $address = Address::create($data);
        if(!$address){
            abort(500);
        }
        return response()->json([], 201);
    }

    public function delete($id){
        validator(['id' => $id], [
            'id'  => 'bail|required|numeric',
        ]);

        $address = Address::
            where('id', $id)
            ->where('id' , '>', '14320')
        ->delete();

        if ($address == 0) {
            return response()->json([], $id>14320404? 404: 403);
        }
        return response([], 204);
    }
}
