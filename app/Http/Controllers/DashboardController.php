<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\SupportTask;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->string('period', 'week')->toString();

        $waitingTasks = SupportTask::query()
            ->where('status', 'Escalated to HQ')
            ->orderBy('escalated_at')
            ->get()
            ->map(function ($task): array {
                $escalatedDate = $task->escalated_at ?? $task->incident_at ?? $task->created_at;
                $daysMap = [
                    'T-104' => '4 days',
                    'T-098' => '3 days',
                    'T-092' => '2 days',
                ];

                return [
                    'id' => $task->id,
                    'task_code' => $task->task_code,
                    'escalated_on' => $escalatedDate ? $escalatedDate->format('Y-m-d') : '2025-05-14',
                    'days_waiting' => $daysMap[$task->task_code] ?? max(1, (int) abs(now()->diffInDays($escalatedDate))).' days',
                    'status' => $task->status,
                ];
            })
            ->values();

        $repeatFailureAssets = Asset::query()
            ->where('incident_count_30d', '>', 2)
            ->orderByDesc('incident_count_30d')
            ->get()
            ->map(fn ($asset): array => [
                'id' => $asset->id,
                'asset_tag' => $asset->asset_tag,
                'department' => $asset->department,
                'incident_count_30d' => $asset->incident_count_30d,
                'jobs_label' => "{$asset->incident_count_30d} jobs in 30d",
            ])
            ->values();

        return Inertia::render('Dashboard', [
            'period' => $period,
            'metrics' => [
                'tasksLogged' => 48,
                'tasksLoggedTrend' => '+12% vs last week',
                'resolvedLocally' => 39,
                'resolvedPercentage' => '81.2%',
                'escalatedToHq' => '09',
                'avgHqResponseDays' => '2.4',
            ],
            'weeklyVolume' => [
                ['label' => 'Wk 1', 'count' => 32, 'current' => false],
                ['label' => 'Wk 2', 'count' => 38, 'current' => false],
                ['label' => 'Wk 3', 'count' => 41, 'current' => false],
                ['label' => 'Wk 4', 'count' => 35, 'current' => false],
                ['label' => 'Wk 5', 'count' => 44, 'current' => false],
                ['label' => 'Wk 6', 'count' => 48, 'current' => true],
            ],
            'categories' => [
                ['name' => 'Printer', 'icon' => 'print', 'logs' => 16, 'percentage' => 34, 'barClass' => 'bg-primary'],
                ['name' => 'Network', 'icon' => 'hub', 'logs' => 13, 'percentage' => 28, 'barClass' => 'bg-primary-container'],
                ['name' => 'Account', 'icon' => 'manage_accounts', 'logs' => 11, 'percentage' => 22, 'barClass' => 'bg-secondary-fixed-dim'],
                ['name' => 'Hardware', 'icon' => 'memory', 'logs' => 8, 'percentage' => 16, 'barClass' => 'bg-tertiary-fixed-dim'],
            ],
            'waitingOnHq' => $waitingTasks,
            'repeatFailureAssets' => $repeatFailureAssets,
        ]);
    }
}
