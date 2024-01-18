<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    use HasFactory;
    protected $table = 'addresses';
    protected $fillable = [
        'state',
        'city',
        'neighborhood'
    ];

    public function stablishment(): HasMany {
        return $this->hasMany(Stablishment::class, 'id', 'fk_address_id');
    }
}
