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

        Event::create([
            'name' => 'Testevent Offline',
            'type_id' => 2,
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

        Event::create([
            'name' => 'Testevent online',
            'type_id' => 3,
            'begins_at' => Carbon::now()->addDay()->toDate(),
            'ends_at' => Carbon::now()->addDay()->toDate(),
            'country' => 'de',
            'description' => 'Irgendein Text',
            'barrier_free' => false,
            'entry_free' => false,
            'online_event' => true,
            'published' => true,
            'event_url' => 'https://some.url',
            'deleted_at' => null,
            'created_by' => 1,
        ]);
    }
}
