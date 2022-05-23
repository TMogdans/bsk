<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Event extends Model
{
    use SoftDeletes;
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'type_id',
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
        'published' => 'boolean',
        'begins_at' => 'date',
        'ends_at' => 'date'
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }
}
