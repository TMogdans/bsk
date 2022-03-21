<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EventTestSeeder extends Seeder
{
    public function run():void
    {
        Event::create([
            'name' => 'Testevent',
            'slug' => 'testevent',
            'type_id' => 1,
            'begins_at' => Carbon::now()->addDay()->toDate(),
            'ends_at' => Carbon::now()->addDay()->toDate(),
            'zip' => '98765',
            'location' => 'Musterstadt',
            'country' => 'de',
            'street' => 'Mustergasse 42b',
            'description' => 'Irgendein Text',
            'barrier_free' => true,
            'entry_free' => true,
            'online_event' => false,
            'published' => true,
            'event_url' => 'https://some.url',
            'deleted_at' => null,
            'created_by' => 1,
        ]);
    }
}
