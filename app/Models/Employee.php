<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'email',
        'gender',
        'phone',
        'note',
        'address',
        'salary'
    ];

    protected $casts = [
        'salary'=>'decimal:2'
    ];
}
