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
        Schema::create('stablishments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('fk_stablishment_types_id');
            $table->unsignedBigInteger('fk_address_id');
            $table->foreign('fk_stablishment_types_id')
                ->references('id')
                ->on('stablishment_types')
                ->onDelete('cascade')
            ->nullable(false);
        
            $table->foreign('fk_address_id')
                ->references('id')
                ->on('addresses')
                ->onDelete('cascade')
            ->nullable(false);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stablishments');
    }
};
