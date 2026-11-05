<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\MaintenanceSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceScheduleController extends Controller
{
    public function index(Request $request): Response
    {
        $statusFilter = $request->string('status', 'all')->toString();
        $deptFilter = $request->string('department', 'all')->toString();
        $typeFilter = $request->string('asset_type', 'all')->toString();

        $query = MaintenanceSchedule::query()->with('asset');

        if ($statusFilter !== 'all') {
            $statusMap = [
                'overdue' => 'Overdue',
                'due-soon' => 'Due in 3 days',
                'upcoming' => 'Scheduled',
                'up-to-date' => 'Scheduled',
            ];
            if (isset($statusMap[$statusFilter])) {
                $query->where('status', $statusMap[$statusFilter]);
            }
        }

        if ($deptFilter !== 'all') {
            $deptMap = [
                'finance' => 'Finance',
                'hr' => 'HR',
                'legal' => 'Legal',
                'logistics' => 'Logistics',
                'it' => 'Engineering',
            ];
            $query->where('department', $deptMap[$deptFilter] ?? $deptFilter);
        }

        if ($typeFilter !== 'all') {
            $typeMap = [
                'printer' => 'Printer',
                'workstation' => 'Workstation',
                'server' => 'Server',
                'network' => 'Network switch',
            ];
            $query->where('asset_type', $typeMap[$typeFilter] ?? $typeFilter);
        }

        $schedules = $query
            ->orderBy('id')
            ->get()
            ->map(fn ($schedule): array => [
                'id' => $schedule->id,
                'asset_id' => $schedule->asset_id,
                'asset_tag' => $schedule->asset?->asset_tag ?? 'AST-0000',
                'department' => $schedule->department,
                'asset_type' => $schedule->asset_type,
                'repeat_interval_days' => $schedule->repeat_interval_days,
                'repeat_label' => "{$schedule->repeat_interval_days} days",
                'last_done_date' => $schedule->last_done_date ? $schedule->last_done_date->format('Y-m-d') : '2024-07-12',
                'next_due_date' => $schedule->next_due_date ? $schedule->next_due_date->format('Y-m-d') : '2024-10-10',
                'status' => $schedule->status,
            ]);

        return Inertia::render('Maintenance/Index', [
            'schedules' => $schedules,
            'filters' => [
                'status' => $statusFilter,
                'department' => $deptFilter,
                'asset_type' => $typeFilter,
            ],
            'metrics' => [
                'overdue' => '04',
                'dueNext7Days' => '08',
                'scheduledTotal' => '36',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'asset_tag' => ['required', 'string', 'max:50'],
            'department' => ['required', 'string', 'max:100'],
            'repeat_interval_days' => ['required', 'integer', 'min:7', 'max:365'],
        ]);

        $assetTag = strtoupper(trim($validated['asset_tag']));

        $asset = Asset::firstOrCreate(
            ['asset_tag' => $assetTag],
            [
                'uid_code' => random_int(10000, 99999).'-M1',
                'asset_class' => 'Peripheral',
                'type' => 'Printer',
                'model' => 'HP Enterprise Endpoint',
                'serial_number' => 'SN'.random_int(100000, 999999),
                'department' => $validated['department'],
                'location' => 'Building A, Floor 1',
                'operational_status' => 'In use',
                'hardware_state' => 'ONLINE',
            ]
        );

        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $asset->id],
            [
                'department' => $validated['department'],
                'asset_type' => $asset->type,
                'repeat_interval_days' => $validated['repeat_interval_days'],
                'last_done_date' => now()->toDateString(),
                'next_due_date' => now()->addDays((int) $validated['repeat_interval_days'])->toDateString(),
                'status' => 'Scheduled',
                'technician_note' => 'By '.($request->user()?->name ?? 'Alex Mercer'),
                'maintenance_note' => 'Scheduled preventative maintenance cycle',
            ]
        );

        return back()->with('success', "Maintenance schedule created for {$assetTag}.");
    }

    public function markDone(MaintenanceSchedule $schedule): RedirectResponse
    {
        $interval = $schedule->repeat_interval_days ?: 90;

        $schedule->update([
            'last_done_date' => now()->toDateString(),
            'next_due_date' => now()->addDays($interval)->toDateString(),
            'status' => 'Scheduled',
        ]);

        return back()->with('success', 'Maintenance schedule marked done and next due date recalculated.');
    }
}
