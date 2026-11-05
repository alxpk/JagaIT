<?php

namespace App\Models;

use Database\Factories\SupportTaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $task_code
 * @property string|null $reference_code
 * @property string|null $sla_tier
 * @property string|null $metadata_classification
 * @property Carbon|null $incident_at
 * @property string $requester_name
 * @property string $department
 * @property string $category
 * @property int|null $asset_id
 * @property int|null $technician_id
 * @property string $technician_name
 * @property string $status
 * @property string $problem_description
 * @property string|null $action_taken
 * @property int $time_spent_minutes
 * @property Carbon|null $escalated_at
 * @property string|null $hq_ticket_ref
 * @property string|null $hq_response
 * @property string|null $hq_dispatch_code
 * @property string|null $state_label
 * @property array<int, array<string, mixed>>|null $attachments
 * @property array<int, array<string, mixed>>|null $audit_trail
 * @property Carbon|null $created_at
 * @property-read Asset|null $asset
 * @property-read User|null $technician
 */
#[Fillable([
    'task_code',
    'reference_code',
    'sla_tier',
    'metadata_classification',
    'incident_at',
    'requester_name',
    'department',
    'category',
    'asset_id',
    'technician_id',
    'technician_name',
    'status',
    'problem_description',
    'action_taken',
    'time_spent_minutes',
    'escalated_at',
    'hq_ticket_ref',
    'hq_response',
    'hq_dispatch_code',
    'state_label',
    'attachments',
    'audit_trail',
])]
class SupportTask extends Model
{
    /** @use HasFactory<SupportTaskFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'incident_at' => 'datetime',
            'escalated_at' => 'datetime',
            'time_spent_minutes' => 'integer',
            'attachments' => 'array',
            'audit_trail' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Asset, $this>
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    /**
     * @return HasMany<KnowledgeBaseArticle, $this>
     */
    public function knowledgeBaseArticles(): HasMany
    {
        return $this->hasMany(KnowledgeBaseArticle::class, 'source_task_id');
    }
}
