<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Product;
use App\Models\Batch;
use App\Models\User;

class Register extends Model
{
    use HasFactory;

    protected $fillable = [
        'fk_stablishment_types_id',
        'fk_products_id',
        'fk_users_id',
        'fk_batchs_id',
        'price',
    ];
}
