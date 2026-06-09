<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'    => 'sometimes|required|string|max:255',
            'email'   => [
                'sometimes',
                'required',
                'email',
                Rule::unique('employees', 'email')->ignore($this->route('employee')?->id),
            ],
            'gender'  => 'sometimes|required|in:male,female,other',
            'phone'   => 'sometimes|required|string|max:20',
            'note'    => 'sometimes|nullable|string',
            'address' => 'sometimes|required|string',
            'salary'  => 'sometimes|required|numeric|min:0',
        ];
    }
}
