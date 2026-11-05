<?php

namespace App\Models;

use Database\Factories\MaintenanceScheduleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $asset_id
 * @property string $department
 * @property string $asset_type
 * @property int $repeat_interval_days
 * @property Carbon|null $last_done_date
 * @property Carbon|null $next_due_date
 * @property string $status
 * @property string|null $technician_note
 * @property string|null $maintenance_note
 * @property-read Asset|null $asset
 */
#[Fillable([
    'asset_id',
    'department',
    'asset_type',
    'repeat_interval_days',
    'last_done_date',
    'next_due_date',
    'status',
    'technician_note',
    'maintenance_note',
])]
class MaintenanceSchedule extends Model
{
    /** @use HasFactory<MaintenanceScheduleFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'repeat_interval_days' => 'integer',
            'last_done_date' => 'date',
            'next_due_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Asset, $this>
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
