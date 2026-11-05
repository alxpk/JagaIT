<?php

namespace Database\Factories;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'asset_tag' => 'AST-'.fake()->unique()->numerify('####'),
            'uid_code' => fake()->numerify('#####').'-E2',
            'asset_class' => fake()->randomElement(['Peripheral', 'Endpoint', 'Infrastructure']),
            'type' => fake()->randomElement(['Printer', 'Workstation', 'Server', 'Network switch']),
            'model' => 'HP LaserJet Enterprise M608dn',
            'serial_number' => strtoupper(fake()->bothify('CNB2K#####')),
            'department' => fake()->randomElement(['Finance', 'Logistics', 'Legal', 'Engineering', 'HR']),
            'location' => 'Building B, Floor 2, Room '.fake()->numberBetween(100, 499),
            'operational_status' => 'In use',
            'warranty_expires_at' => '2026-10-14',
            'warranty_tier' => 'Active · Tier-1 Enterprise Care Pack',
            'hardware_state' => 'ONLINE',
            'ip_address' => fake()->localIpv4(),
            'mac_address' => strtoupper(fake()->macAddress()),
            'toner_level' => fake()->numberBetween(20, 100),
            'total_page_count' => fake()->numberBetween(10000, 200000),
            'incident_count_30d' => fake()->numberBetween(0, 5),
        ];
    }
}
