<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            //'paginate'=>$this,
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'measurementUnit' => $this->measurementUnit,
            'barCode' => $this->barCode,
            'created_at' => Carbon::make($this->created_at)->format("d/m/Y - H:i"),
            'updated_at' => Carbon::make($this->updated_at)->format("d/m/Y - H:i"),
        ];
    }
}
