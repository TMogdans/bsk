<?php

declare(strict_types=1);

namespace App\Services\EventFilter;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class BarrierFreeFilter implements EventFilterInterface
{

    public function apply(Builder $query, Request $request): void
    {
        $query->where('barrier_free', filter_var($request->query('barrierFree'), FILTER_VALIDATE_BOOLEAN));
    }
}
