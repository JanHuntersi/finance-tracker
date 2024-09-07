<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetRequest extends FormRequest
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
     * @return array
     */
    public function rules(): array
    {
        // Initialize an array for validation rules
        $rules = [];

        // Define valid prefixes
        $validPrefixes = ['expenses', 'savings', 'incomes'];

        // Loop through all inputs
        foreach ($this->all() as $key => $value) {

            // Check if the input key matches the valid prefixes and pattern
            foreach ($validPrefixes as $prefix) {

                // Pattern for matching keys like 'expenses_1_1', 'expenses_1', etc.
                if (preg_match('/^' . $prefix . '(_\d+(_\d+)?)?$/', $key)) {
                    // Add validation rule for positive numeric values
                    $rules[$key] = 'numeric|min:0';
                }
            }
        }

        return $rules;
    }
}
