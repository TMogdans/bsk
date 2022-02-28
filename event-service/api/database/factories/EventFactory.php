<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'slug' => $this->faker->slug(),
            'type_id' => $this->faker->numberBetween(1, 6),
            'begins_at' => $this->faker->date(),
            'ends_at' => $this->faker->date(),
            'zip' => $this->faker->postcode(),
            'location' => $this->faker->city(),
            'country' => $this->faker->country(),
            'street' => $this->faker->streetAddress(),
            'description' => $this->faker->text(),
            'barrier_free' => $this->faker->boolean(),
            'entry_free' => $this->faker->boolean(70),
            'online_event' => $this->faker->boolean(),
            'published' => $this->faker->boolean(80),
            'event_url' => $this->faker->url(),
            'deleted_at' => null,
            'created_by' => 1,
        ];
    }
}
