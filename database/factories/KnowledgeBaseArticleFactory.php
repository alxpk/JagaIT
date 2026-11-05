<?php

namespace Database\Factories;

use App\Models\KnowledgeBaseArticle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KnowledgeBaseArticle>
 */
class KnowledgeBaseArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'doc_id' => 'KB-'.fake()->unique()->numerify('####'),
            'title' => fake()->sentence(6),
            'category' => fake()->randomElement(['Printer', 'Account', 'Network', 'Hardware', 'VPN']),
            'author_name' => 'J. Doe',
            'is_verified' => true,
            'status' => 'Verified',
            'summary' => fake()->sentence(12),
            'problem_description' => fake()->paragraph(),
            'steps' => [
                'Isolate unit from power network.',
                'Inspect serial lot number.',
                'Apply configuration reset.',
            ],
            'helpful_count' => fake()->numberBetween(5, 50),
            'published_date_label' => 'Oct 24, 2024',
        ];
    }
}
