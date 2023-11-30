<?php

namespace App\Http\Resources\stablishment;

use App\Models\Address;
use App\Models\StablishmentType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StablishmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'stablishmentType' => StablishmentType::select('name')->find($this->fk_stablishment_type_id),
            'address' => Address::select('id', 'state', 'city', 'neighborhood')->find($this->fk_address_id),
        ];
    }
}
