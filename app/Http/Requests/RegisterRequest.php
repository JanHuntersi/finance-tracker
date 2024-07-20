<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'username'),
            ],
            'email' => [
                'nullable',
                'string',
                'email',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            'passwordConfirmation' => [
                'required',
                'string',
                'same:password',
            ],
        ];
    }
}
