<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Register;
use App\Models\StablishmentType;

class Batch extends Model
{
    use HasFactory;
    protected $table = 'batchs';

    protected $fillable = [
        'name',
        'fk_stablishment_types_id'
    ];

    /*public function register(): BelongsTo{
        return $this->belongsTo(Register::class);
    }*/
 
    public function StablishmentType(): BelongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_types_id', 'id');
    }
}
