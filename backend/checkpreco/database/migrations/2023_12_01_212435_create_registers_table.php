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
        Schema::create('registers', function (Blueprint $table) {
            $table->id();
            $table->double('price', 5, 2)->nullable(true);
            $table->unsignedBigInteger('fk_products_id');
            $table->unsignedBigInteger('fk_users_id');
            $table->unsignedBigInteger('fk_stablishments_id');
            $table->unsignedBigInteger('fk_batchs_id');

            $table->foreign('fk_products_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade')
            ->nullable(false);

            $table->foreign('fk_users_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade')
            ->nullable(true);

            $table->foreign('fk_stablishments_id')
                ->references('id')
                ->on('stablishments')
                ->onDelete('cascade')
            ->nullable(false);

            $table->foreign('fk_batchs_id')
                ->references('id')
                ->on('batchs')
                ->onDelete('cascade')
            ->nullable(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registers');
    }
};
