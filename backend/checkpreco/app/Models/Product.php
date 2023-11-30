<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Register;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'measurementUnit',
        'barCode',
    ];

    /*public function register(): BelongsTo{
        return $this->belongsTo(Register::class);
    }*/
}
