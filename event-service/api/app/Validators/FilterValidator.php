<?php

declare(strict_types=1);

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Validation\Rule;

class FilterValidator implements MakeRequestValidatorInterface
{
    public function getValidator(Request $request): Validator
    {
        return ValidatorFacade::make($request->query(), [
            'presence' => [
                Rule::in(['online', 'offline']),
            ],
            'type' => 'exists:types,name',
            'barrierFree' => [
                Rule::in(['true', 'false']),
            ],
            'entryFree' => [
                Rule::in(['true', 'false']),
            ]
        ]);
    }
}
