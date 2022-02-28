<?php

namespace Database\Seeders;

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
            ['name' => 'convention'],
            ['name' => 'fair'],
            ['name' => 'tournament'],
            ['name' => 'release'],
            ['name' => 'award'],
            ['name' => 'other']
        ];

        DB::table('types')->insert($types);
    }
}
