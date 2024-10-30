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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->text('details')->nullable();
            $table->string('top')->nullable();
            $table->string('feat')->nullable();
            $table->text('k_details')->nullable();
            $table->text('d_details')->nullable();
            $table->text('sip_details')->nullable();
            $table->text('o_details')->nullable();
            $table->decimal('price', 8, 2)->default(0.00);
            $table->decimal('discount', 8, 2)->default(0.00);
            $table->decimal('offer_price', 8, 2)->default(0.00);
            $table->string('mfg_name')->nullable();
            $table->integer('total_qty')->default(0);
            $table->integer('alert_qty')->default(5);
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->bigInteger('subcategory_id')->nullable();
            $table->foreignId('tax_id')->nullable()->constrained('taxes')->onDelete('set null');
            $table->boolean('prescription')->default(0);
            $table->unsignedTinyInteger('status')->default(0);
            $table->boolean('returnable')->default(0);
            $table->integer('return_time')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
