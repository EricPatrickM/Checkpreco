<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StablishmentType extends Model
{
    use HasFactory;
    protected $table = 'stablishment_types';
    
    protected $fillable = [
        'name'
    ];

    public function stablishment(): HasMany
    {
        return $this->hasMany(Stablishment::class, 'fk_stablishment_type_id');
    }
}
