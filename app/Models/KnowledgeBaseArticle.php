<?php

namespace App\Models;

use Database\Factories\KnowledgeBaseArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $doc_id
 * @property string $title
 * @property string $category
 * @property string $author_name
 * @property bool $is_verified
 * @property string $status
 * @property int|null $source_task_id
 * @property string $summary
 * @property string $problem_description
 * @property array<int, string>|null $steps
 * @property int $helpful_count
 * @property string|null $published_date_label
 * @property-read SupportTask|null $sourceTask
 */
#[Fillable([
    'doc_id',
    'title',
    'category',
    'author_name',
    'is_verified',
    'status',
    'source_task_id',
    'summary',
    'problem_description',
    'steps',
    'helpful_count',
    'published_date_label',
])]
class KnowledgeBaseArticle extends Model
{
    /** @use HasFactory<KnowledgeBaseArticleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'steps' => 'array',
            'helpful_count' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<SupportTask, $this>
     */
    public function sourceTask(): BelongsTo
    {
        return $this->belongsTo(SupportTask::class, 'source_task_id');
    }
}
