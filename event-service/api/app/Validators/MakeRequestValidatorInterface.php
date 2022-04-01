<?php

declare(strict_types=1);

namespace App\Validators;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;

interface MakeRequestValidatorInterface
{
    public function getValidator(Request $request): Validator;
}
