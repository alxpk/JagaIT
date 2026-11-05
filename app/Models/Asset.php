<?php

namespace App\Models;

use Database\Factories\AssetFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $asset_tag
 * @property string|null $uid_code
 * @property string|null $asset_class
 * @property string $type
 * @property string $model
 * @property string $serial_number
 * @property string $department
 * @property string $location
 * @property string $operational_status
 * @property Carbon|null $warranty_expires_at
 * @property string|null $warranty_tier
 * @property string|null $hardware_state
 * @property string|null $ip_address
 * @property string|null $mac_address
 * @property int|null $toner_level
 * @property int|null $total_page_count
 * @property string|null $image_url
 * @property int $incident_count_30d
 * @property-read MaintenanceSchedule|null $maintenanceSchedule
 * @property-read Collection<int, SupportTask> $supportTasks
 */
#[Fillable([
    'asset_tag',
    'uid_code',
    'asset_class',
    'type',
    'model',
    'serial_number',
    'department',
    'location',
    'operational_status',
    'warranty_expires_at',
    'warranty_tier',
    'hardware_state',
    'ip_address',
    'mac_address',
    'toner_level',
    'total_page_count',
    'image_url',
    'incident_count_30d',
])]
class Asset extends Model
{
    /** @use HasFactory<AssetFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'warranty_expires_at' => 'date',
            'toner_level' => 'integer',
            'total_page_count' => 'integer',
            'incident_count_30d' => 'integer',
        ];
    }

    /**
     * @return HasMany<SupportTask, $this>
     */
    public function supportTasks(): HasMany
    {
        return $this->hasMany(SupportTask::class);
    }

    /**
     * @return HasOne<MaintenanceSchedule, $this>
     */
    public function maintenanceSchedule(): HasOne
    {
        return $this->hasOne(MaintenanceSchedule::class);
    }
}
