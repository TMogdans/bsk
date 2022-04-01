<?php

namespace Database\Seeders;

use App\Models\Type;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'convention',
                'translation' => [
                    'en' => 'Convention',
                    'de' => 'Kongress'
                ]
            ],
            [
                'name' => 'fair',
                'translation' => [
                    'en' => 'Fair',
                    'de' => 'Messe'
                ]
            ],
            [
                'name' => 'tournament',
                'translation' => [
                    'en' => 'Tournament',
                    'de' => 'Turnier'
                ]
            ],
            [
                'name' => 'release',
                'translation' => [
                    'en' => 'Release',
                    'de' => 'Veröffentlichung'
                ]
            ],
            [
                'name' => 'award',
                'translation' => [
                    'en' => 'Award',
                    'de' => 'Preisverleihung'
                ]
            ],
            [
                'name' => 'other',
                'translation' => [
                    'en' => 'Other',
                    'de' => 'Anderes'
                ]
            ],
        ];

        foreach ($types as $type) {
            Type::create($type);
        }
    }
}
