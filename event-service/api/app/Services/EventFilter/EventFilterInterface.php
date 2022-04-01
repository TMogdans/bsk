<?php

declare(strict_types=1);

namespace App\Services\EventFilter;


use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

interface EventFilterInterface
{
    public function apply(Builder $query, Request $request): void;
}
