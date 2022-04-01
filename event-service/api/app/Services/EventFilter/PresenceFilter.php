<?php

declare(strict_types=1);

namespace App\Services\EventFilter;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PresenceFilter implements EventFilterInterface
{

    public function apply(Builder $query, Request $request): void
    {
        $presence = $request->query('presence') === 'online';

        $query->where('online_event', $presence);
    }
}
