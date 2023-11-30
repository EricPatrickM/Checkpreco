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
        Schema::table('stablishments', function (Blueprint $table) {
            $table->foreignId('fk_address_id')
            ->references('id')
            ->on('addresses')
            ->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stablishments', function (Blueprint $table) {
            $table->foreignId('fk_address_id')
            ->references('id')
            ->on('addresses')
            ->onDelete('cascade');
        });
    }
};
