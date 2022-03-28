<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->unsignedBigInteger('type_id');
            $table->timestamp('begins_at')->default(new \Carbon\Carbon());
            $table->timestamp('ends_at')->default(new \Carbon\Carbon());
            $table->string('zip')->nullable();
            $table->string('location')->nullable();
            $table->string('country');
            $table->string('street')->nullable();
            $table->text('description');
            $table->boolean('barrier_free')->default(false);
            $table->boolean('entry_free')->default(false);
            $table->boolean('online_event')->default(false);
            $table->boolean('published')->default(false);
            $table->string('event_url');
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable()->default(null);
            $table->unsignedBigInteger('created_by');

            $table
                ->foreign('type_id')
                ->references('id')
                ->on('types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
};
