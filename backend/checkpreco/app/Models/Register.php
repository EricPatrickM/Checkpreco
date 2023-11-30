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
    
    public function product():HasOne{
        return $this->hasOne(Product::class);
    }

    public function batch():HasOne{
        return $this->hasOne(Batch::class);
    }

    public function user():HasOne{
        return $this->hasOne(User::class);
    }

    /*public function establishment(){
        return $this->hasOne(Product);
    }*/
}
