<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stablishment extends Model
{
    use HasFactory;
    protected $table = 'stablishments';
    protected $fillable = [
        'name',
        'fk_stablishment_types_id',
        'fk_address_id'
    ];

    protected $visible = [
        'id',
        'name',
        'fk_stablishment_types_id',
        'fk_address_id',
    ];


    public function stablishmentType(): BelongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_types_id', 'id');
    }

    public function address(): BelongsTo{
        return $this->belongsTo(Address::class, 'fk_address_id', 'id');
    }

    public function register(): hasMany{
        return $this->hasMany(Register::class, 'id', 'fk_stablishment_id');
    }
}
