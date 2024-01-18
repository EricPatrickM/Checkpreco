<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\StablishmentType;
use Illuminate\Database\Eloquent\Relations\hasMany;

class Batch extends Model
{
    use HasFactory;
    protected $table = 'batchs';

    protected $fillable = [
        'name',
        'fk_stablishment_types_id'
    ];

    protected $visible = [
        'id',
        'name',
    ];

    public function stablishmentType(): belongsTo{
        return $this->belongsTo(StablishmentType::class, 'fk_stablishment_types_id', 'id');
    }

    public function register(): hasMany{
        return $this->hasMany(Register::class, 'id', 'fk_batch_id');
    }
}
