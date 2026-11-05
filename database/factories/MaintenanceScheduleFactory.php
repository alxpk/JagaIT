<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\MaintenanceSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaintenanceSchedule>
 */
class MaintenanceScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'asset_id' => Asset::factory(),
            'department' => fake()->randomElement(['Finance', 'Engineering', 'HR', 'Logistics', 'Legal']),
            'asset_type' => fake()->randomElement(['Printer', 'Workstation', 'Server', 'Network switch']),
            'repeat_interval_days' => fake()->randomElement([30, 60, 90, 180]),
            'last_done_date' => now()->subDays(30)->toDateString(),
            'next_due_date' => now()->addDays(60)->toDateString(),
            'status' => 'Scheduled',
            'technician_note' => 'By Dispatch Tech #12',
            'maintenance_note' => 'Inspection & roller cleaning required',
        ];
    }
}
