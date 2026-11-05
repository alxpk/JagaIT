<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\SupportTask;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SupportTask>
 */
class SupportTaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_code' => 'T-'.fake()->unique()->numerify('###'),
            'reference_code' => fake()->numerify('####').'-X',
            'sla_tier' => 'Tier 3',
            'metadata_classification' => 'C-4',
            'incident_at' => now()->subDays(fake()->numberBetween(1, 14)),
            'requester_name' => fake()->name(),
            'department' => fake()->randomElement(['Finance', 'Logistics', 'Legal', 'Engineering', 'HR']),
            'category' => fake()->randomElement(['Printer', 'Network', 'Account', 'Hardware', 'Software']),
            'asset_id' => Asset::factory(),
            'technician_name' => fake()->randomElement(['J. Doe', 'M. Smith', 'A. Patel', 'R. Vance']),
            'status' => fake()->randomElement(['Open', 'In progress', 'Escalated to HQ', 'Resolved', 'Verified']),
            'problem_description' => fake()->sentence(10),
            'action_taken' => fake()->sentence(8),
            'time_spent_minutes' => fake()->numberBetween(15, 120),
            'state_label' => 'PENDING PARTS DISPATCH',
            'attachments' => [],
            'audit_trail' => [],
        ];
    }
}
