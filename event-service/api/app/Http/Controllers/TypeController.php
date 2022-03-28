<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\TypeResource;
use App\Models\Type;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeController extends Controller
{
    public function index(): JsonResource
    {
        $types = Type::all();

        return TypeResource::collection($types);
    }
}
