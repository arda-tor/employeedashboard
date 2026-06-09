<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SocialBenefit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'default_amount',
    ];

    protected $casts = [
        'default_amount' => 'decimal:2',
    ];

    public function employeeSocialBenefits(): HasMany
    {
        return $this->hasMany(EmployeeSocialBenefit::class);
    }
}
