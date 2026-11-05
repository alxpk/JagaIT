<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $assets = Asset::query()
            ->with('maintenanceSchedule')
            ->orderBy('asset_tag')
            ->get()
            ->map(fn ($asset): array => [
                'id' => $asset->id,
                'asset_tag' => $asset->asset_tag,
                'uid_code' => $asset->uid_code,
                'asset_class' => $asset->asset_class,
                'type' => $asset->type,
                'model' => $asset->model,
                'serial_number' => $asset->serial_number,
                'department' => $asset->department,
                'location' => $asset->location,
                'operational_status' => $asset->operational_status,
                'hardware_state' => $asset->hardware_state,
                'ip_address' => $asset->ip_address,
                'incident_count_30d' => $asset->incident_count_30d,
                'next_due_date' => $asset->maintenanceSchedule?->next_due_date?->format('Y-m-d'),
                'maintenance_status' => $asset->maintenanceSchedule?->status ?? 'Scheduled',
            ]);

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
        ]);
    }

    public function show(Asset $asset): Response
    {
        $asset->load(['maintenanceSchedule', 'supportTasks' => fn ($q) => $q->orderByDesc('incident_at')]);

        $schedule = $asset->maintenanceSchedule;

        $jobHistory = $asset->supportTasks->map(fn ($task): array => [
            'id' => $task->id,
            'task_code' => $task->task_code,
            'date' => $task->incident_at ? $task->incident_at->format('M d, Y') : 'Feb 13, 2025',
            'problem' => $task->problem_description,
            'action_taken' => $task->action_taken ?? 'Escalated for diagnostics',
            'status' => $task->status,
        ])->values();

        return Inertia::render('Assets/Show', [
            'asset' => [
                'id' => $asset->id,
                'asset_tag' => $asset->asset_tag,
                'uid_code' => $asset->uid_code ?? '98104-E2',
                'asset_class' => $asset->asset_class ?? 'Peripheral',
                'type' => $asset->type,
                'model' => $asset->model,
                'serial_number' => $asset->serial_number,
                'department' => $asset->department === 'Finance' ? 'Finance Operations' : $asset->department,
                'raw_department' => $asset->department,
                'location' => $asset->location,
                'operational_status' => $asset->operational_status,
                'warranty_expires_label' => $asset->warranty_expires_at ? $asset->warranty_expires_at->format('F d, Y') : 'October 14, 2026',
                'warranty_tier' => $asset->warranty_tier ?? 'Active · Tier-1 Enterprise Care Pack',
                'hardware_state' => $asset->hardware_state ?? 'ONLINE',
                'ip_address' => $asset->ip_address ?? '10.14.88.204',
                'mac_address' => $asset->mac_address ?? 'B4:2E:99:A1:0C',
                'toner_level' => $asset->toner_level ?? 78,
                'total_page_count' => number_format($asset->total_page_count ?? 148920).' pages',
                'image_url' => $asset->image_url ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqYdAWXIrAYQVyB9VSY4icgYH2nKtySmVVIvM5OCFHXFhuGNfIOjHzS4nqPbDkhDkmCVzl3iU5u9QbhUcqgJJN2wdacdSGo0qIymjGY0N5OppFC_yBgIU3YzBJktmPL5Dr2cnWPM1KBtCgzwYdvxCj8zLelxCELYgtCbTbbYj2fkety3f4InlulilFtpXGh0Go4xmNEBAU1dQzIYqEmFcB1uzCC6Uw412tNMCDtKzQ',
            ],
            'maintenance' => [
                'id' => $schedule?->id,
                'repeat_every' => ($schedule?->repeat_interval_days ?? 90).' days',
                'repeat_interval_days' => $schedule?->repeat_interval_days ?? 90,
                'last_done' => $schedule?->last_done_date ? $schedule->last_done_date->format('F d, Y') : 'November 12, 2024',
                'next_due' => $schedule?->next_due_date ? $schedule->next_due_date->format('F d, Y') : 'February 10, 2025',
                'status' => $schedule?->status ?? 'Overdue',
                'overdue_badge' => ($schedule?->status ?? 'Overdue') === 'Overdue' ? 'Overdue by 3 days' : ($schedule?->status ?? 'Scheduled'),
                'technician_note' => $schedule?->technician_note ?? 'By Dispatch Tech #12',
                'maintenance_note' => $schedule?->maintenance_note ?? 'Inspection & roller cleaning required',
            ],
            'jobHistory' => $jobHistory,
        ]);
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $action = $request->string('action')->toString();

        if ($action === 'mark_maintenance_done') {
            $schedule = $asset->maintenanceSchedule;
            $interval = $schedule?->repeat_interval_days ?? 90;

            if ($schedule) {
                $schedule->update([
                    'last_done_date' => now()->toDateString(),
                    'next_due_date' => now()->addDays($interval)->toDateString(),
                    'status' => 'Scheduled',
                ]);
            } else {
                $asset->maintenanceSchedule()->create([
                    'department' => $asset->department,
                    'asset_type' => $asset->type,
                    'repeat_interval_days' => 90,
                    'last_done_date' => now()->toDateString(),
                    'next_due_date' => now()->addDays(90)->toDateString(),
                    'status' => 'Scheduled',
                    'technician_note' => 'By '.($request->user()?->name ?? 'Alex Mercer'),
                    'maintenance_note' => 'Preventative maintenance cycle completed',
                ]);
            }

            return back()->with('success', "Maintenance marked done for {$asset->asset_tag}.");
        }

        if ($action === 'toggle_status') {
            $statuses = ['In use', 'Maintenance', 'Standby'];
            $currentIndex = array_search($asset->operational_status, $statuses, true);
            $nextStatus = $statuses[(($currentIndex === false ? 0 : $currentIndex) + 1) % count($statuses)];

            $asset->update(['operational_status' => $nextStatus]);

            return back()->with('success', "Operational status changed to {$nextStatus}.");
        }

        $validated = $request->validate([
            'model' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:100'],
            'department' => ['required', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:255'],
            'operational_status' => ['required', 'string', 'max:100'],
        ]);

        $asset->update($validated);

        return back()->with('success', "Asset {$asset->asset_tag} updated.");
    }
}
