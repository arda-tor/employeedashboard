<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:employees',
            'gender'  => 'required|in:male,female,other',
            'phone'   => 'required|string|max:20',
            'note'    => 'nullable|string',
            'address' => 'required|string',
            'salary'  => 'required|numeric|min:0',
        ];
    }
}