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
        Schema::create('support_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_code')->unique();
            $table->string('reference_code')->nullable();
            $table->string('sla_tier')->default('Tier 3');
            $table->string('metadata_classification')->default('C-4');
            $table->timestamp('incident_at')->nullable();
            $table->string('requester_name');
            $table->string('department');
            $table->string('category');
            $table->foreignId('asset_id')->nullable()->constrained('assets')->nullOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('technician_name')->default('J. Doe');
            $table->string('status')->default('Open');
            $table->text('problem_description');
            $table->text('action_taken')->nullable();
            $table->unsignedInteger('time_spent_minutes')->default(0);
            $table->timestamp('escalated_at')->nullable();
            $table->string('hq_ticket_ref')->nullable();
            $table->text('hq_response')->nullable();
            $table->string('hq_dispatch_code')->nullable();
            $table->string('state_label')->default('PENDING PARTS DISPATCH');
            $table->json('attachments')->nullable();
            $table->json('audit_trail')->nullable();
            $table->timestamps();

            $table->index(['status', 'department', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_tasks');
    }
};
