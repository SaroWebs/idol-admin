<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('core_images', function (Blueprint $table) {
            $table->id();
            $table->string('image_url')->nullable();
            $table->string('type')->nullable();
            $table->string('heading')->nullable();
            $table->string('tag')->nullable();
            $table->string('place')->nullable();
            $table->unsignedInteger('status')->nullable(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('core_images');
    }
};
