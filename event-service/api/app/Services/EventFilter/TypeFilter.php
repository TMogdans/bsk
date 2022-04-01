<?php

declare(strict_types=1);

namespace App\Services\EventFilter;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TypeFilter implements EventFilterInterface
{

    public function apply(Builder $query, Request $request): void
    {
        $type = $request->query('type');

        $query->whereHas('type', fn ($q) => $q->where('name', $type));
    }
}
