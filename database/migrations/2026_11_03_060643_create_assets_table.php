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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_tag')->unique();
            $table->string('uid_code')->nullable();
            $table->string('asset_class')->default('Peripheral');
            $table->string('type')->default('Printer');
            $table->string('model');
            $table->string('serial_number');
            $table->string('department');
            $table->string('location');
            $table->string('operational_status')->default('In use');
            $table->date('warranty_expires_at')->nullable();
            $table->string('warranty_tier')->nullable();
            $table->string('hardware_state')->default('ONLINE');
            $table->string('ip_address')->nullable();
            $table->string('mac_address')->nullable();
            $table->unsignedTinyInteger('toner_level')->nullable();
            $table->unsignedInteger('total_page_count')->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->unsignedInteger('incident_count_30d')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
