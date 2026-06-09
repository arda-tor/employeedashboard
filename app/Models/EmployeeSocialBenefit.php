<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeSocialBenefit extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'social_benefit_id',
        'amount',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function socialBenefit(): BelongsTo
    {
        return $this->belongsTo(SocialBenefit::class);
    }
}
