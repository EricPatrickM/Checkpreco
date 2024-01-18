<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'measurementUnit',
        'barCode',
        'fk_stablishment_types_id'
    ];

    protected $visible = [
        'name',
        'description',
        'measurementUnit',
        'barCode',
        'fk_stablishment_types_id'
    ];

    public function register(): hasMany{
        return $this->hasMany(Register::class, 'id', 'fk_product_id');
    }

    public function stablishmentType(): belongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_types_id', 'id');
    }
}
