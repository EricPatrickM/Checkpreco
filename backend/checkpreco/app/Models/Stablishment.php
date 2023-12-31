<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stablishment extends Model
{
    use HasFactory;
    protected $table = 'stablishments';
    protected $fillable = [
        'name',
        'fk_stablishment_types_id',
        'fk_address_id'
    ];

    public function stablishmentType(): BelongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_types_id');
    }

    public function Address(): BelongsTo{
        return $this->belongsTo(Address::class, 'fk_address_id');
    }
}
