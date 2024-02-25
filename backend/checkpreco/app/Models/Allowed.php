<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allowed extends Model
{
    use HasFactory;
    protected $table = 'alloweds';
    
    protected $fillable = [
        'fk_stablishments_id',
        'fk_users_id'
    ];
    
}
