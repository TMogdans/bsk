<?php

declare(strict_types=1);

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as ValidatorFacade;

class EventValidator implements MakeRequestValidatorInterface
{

    public function getValidator(Request $request): Validator
    {
        return ValidatorFacade::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|string|exists:types,name',
            'beginsAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'required|date_format:Y-m-d',
            'zip' => 'string|required_if:onlineEvent,false',
            'location' => 'string|required_if:onlineEvent,false',
            'country' => 'required|string|size:2',
            'street' => 'string|required_if:onlineEvent,false',
            'description' => 'required|string',
            'barrierFree' => 'boolean|required_if:onlineEvent,false',
            'entryFree' => 'required|boolean',
            'onlineEvent' => 'required|boolean',
            'eventUrl' => 'required|url'
        ]);
    }
}
