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
        Schema::create('alloweds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_stablishments_id')
                ->references('id')
                ->on('stablishments')
            ->nullable(false);
            $table->foreignId('fk_users_id')
                ->references('id')
                ->on('users')
            ->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allowed');
    }
};
