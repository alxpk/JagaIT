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
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('department');
            $table->string('asset_type')->default('Printer');
            $table->unsignedInteger('repeat_interval_days')->default(90);
            $table->date('last_done_date');
            $table->date('next_due_date');
            $table->string('status')->default('Scheduled');
            $table->string('technician_note')->nullable();
            $table->string('maintenance_note')->nullable();
            $table->timestamps();

            $table->index(['status', 'department', 'asset_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};
