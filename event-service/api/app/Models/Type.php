<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Type extends Model
{
    use HasTranslations;

    public array $translatable = ['translation'];

    protected $fillable = [
        'name',
        'translation'
    ];

    public $timestamps = false;

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
