<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeSocialBenefitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'social_benefit_id' => 'sometimes|required|exists:social_benefits,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:active,inactive',
        ];
    }
}
