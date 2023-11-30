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
        
    ];

    public function stablishmentType(): BelongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_type_id');
    }
}
