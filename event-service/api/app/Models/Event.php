<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'begins_at',
        'ends_at',
        'zip',
        'location',
        'country',
        'street',
        'description',
        'barrier_free',
        'entry_free',
        'online_event',
        'published',
        'event_url',
        'deleted_at',
        'created_by'
    ];

    protected $casts = [
        'barrier_free' => 'boolean',
        'entry_free' => 'boolean',
        'online_event' => 'boolean',
        'published' => 'boolean'
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }
}
