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

    protected $visible =[
        'id',
        'name',
    ];

    public function batches(): hasMany{
        return $this->hasMany(Batch::class, 'id', 'fk_stablishment_types_id');
    }

    public function stablishment(): hasMany{
        return $this->hasMany(Stablishment::class, 'id', 'fk_stablishment_types_id');
    }

    public function product(): hasMany{
        return $this->hasMany(Product::class, 'id', 'fk_stablishment_types_id');
    }
}
