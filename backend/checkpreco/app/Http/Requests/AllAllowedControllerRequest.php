<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AllAllowedControllerRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fk_stablishments_id' => 'required|exists:stablishments,id',
            'fk_users_id' => 'required|exists:users,id'
        ];
    }
}
