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
        'price',
        'fk_products_id',
        'fk_user_id',
        'fk_stablishments_id',
        'fk_batchs_id',
    ];

    public function batch(){
        return $this->belongsTo(Batch::class, 'fk_batch_id', 'id');
    }

    public function product(){
        return $this->belongsTo(Product::class, 'fk_product_id', 'id');
    }

    public function stablishment(){
        return $this->belongsTo(Stablishment::class, 'fk_product_id', 'id');
    }

    public function user(){
        return $this->belongsTo(User::class, 'fk_product_id', 'id');
    }
}
