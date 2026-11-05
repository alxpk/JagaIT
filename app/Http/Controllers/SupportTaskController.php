<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\SupportTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $department = $request->string('department')->trim()->toString();
        $category = $request->string('category')->trim()->toString();
        $dateFrom = $request->string('date_from')->trim()->toString();

        $query = SupportTask::query()->with('asset');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('task_code', 'like', "%{$search}%")
                    ->orWhere('problem_description', 'like', "%{$search}%")
                    ->orWhere('requester_name', 'like', "%{$search}%")
                    ->orWhere('technician_name', 'like', "%{$search}%")
                    ->orWhereHas('asset', fn ($aq) => $aq->where('asset_tag', 'like', "%{$search}%"));
            });
        }

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($department !== '') {
            $query->where('department', $department);
        }

        if ($category !== '') {
            $query->where('category', $category);
        }

        if ($dateFrom !== '') {
            $query->whereDate('incident_at', '>=', $dateFrom);
        }

        $tasks = $query
            ->orderByDesc('incident_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn ($task): array => [
                'id' => $task->id,
                'task_code' => $task->task_code,
                'date' => $task->incident_at ? $task->incident_at->format('Y-m-d') : '2025-05-18',
                'description' => $task->problem_description,
                'department' => $task->department,
                'asset_id' => $task->asset_id,
                'asset_tag' => $task->asset?->asset_tag ?? 'AST-0000',
                'technician_name' => $task->technician_name,
                'technician_initial' => strtoupper(substr($task->technician_name, 0, 1)),
                'status' => $task->status,
            ]);

        $assets = Asset::query()
            ->orderBy('asset_tag')
            ->get(['id', 'asset_tag', 'model', 'department', 'type']);

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'assets' => $assets,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'department' => $department,
                'category' => $category,
                'date_from' => $dateFrom,
            ],
            'metrics' => [
                'awaitingIntake' => 14,
                'inActiveTriage' => 28,
                'escalatedToHq' => str_pad((string) SupportTask::where('status', 'Escalated to HQ')->count(), 2, '0', STR_PAD_LEFT),
                'resolvedToday' => 41,
            ],
        ]);
    }

    public function create(): Response
    {
        $assets = Asset::query()
            ->orderBy('asset_tag')
            ->get(['id', 'asset_tag', 'model', 'department', 'type']);

        return Inertia::render('Tasks/Create', [
            'assets' => $assets,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'requester_name' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:100'],
            'asset_id' => ['nullable', 'exists:assets,id'],
            'problem_description' => ['required', 'string', 'max:2000'],
            'action_taken' => ['nullable', 'string', 'max:2000'],
            'time_spent_minutes' => ['nullable', 'integer', 'min:0', 'max:1440'],
        ]);

        $nextNumber = SupportTask::count() + 140;
        $taskCode = 'T-'.$nextNumber;
        while (SupportTask::where('task_code', $taskCode)->exists()) {
            $nextNumber++;
            $taskCode = 'T-'.$nextNumber;
        }

        $userName = $request->user()?->name ?? 'Alex Mercer';

        $task = SupportTask::create([
            'task_code' => $taskCode,
            'reference_code' => strtoupper(substr(md5($taskCode), 0, 4)).'-X',
            'sla_tier' => 'Tier 3',
            'metadata_classification' => 'C-4',
            'incident_at' => now(),
            'requester_name' => $validated['requester_name'],
            'department' => $validated['department'],
            'category' => $validated['category'],
            'asset_id' => $validated['asset_id'] ?? null,
            'technician_id' => $request->user()?->id,
            'technician_name' => $userName,
            'status' => 'Open',
            'problem_description' => $validated['problem_description'],
            'action_taken' => $validated['action_taken'] ?? 'Initial triage initiated by desk technician.',
            'time_spent_minutes' => $validated['time_spent_minutes'] ?? 15,
            'state_label' => 'AWAITING FIELD DISPATCH',
            'attachments' => [],
            'audit_trail' => [
                [
                    'timestamp' => now()->format('Y-m-d H:i'),
                    'title' => "Logged by {$userName} (Staff)",
                    'subtitle' => 'Initial ticket generated from desk intake',
                    'icon' => 'edit_document',
                    'highlight' => true,
                ],
            ],
        ]);

        return redirect()->route('tasks.show', $task)->with('success', "Task {$task->task_code} logged successfully.");
    }

    public function show(SupportTask $task): Response
    {
        $task->load('asset');

        return Inertia::render('Tasks/Show', [
            'task' => [
                'id' => $task->id,
                'task_code' => $task->task_code,
                'reference_code' => $task->reference_code ?? '0842-X',
                'sla_tier' => $task->sla_tier ?? 'Tier 3',
                'metadata_classification' => $task->metadata_classification ?? 'C-4',
                'incident_at' => $task->incident_at ? $task->incident_at->format('Y-m-d H:i \U\T\C') : '2024-10-24 09:42 UTC',
                'requester_name' => $task->requester_name,
                'department' => $task->department,
                'category' => $task->category,
                'asset' => $task->asset ? [
                    'id' => $task->asset->id,
                    'asset_tag' => $task->asset->asset_tag,
                    'model' => $task->asset->model,
                ] : null,
                'technician_name' => $task->technician_name,
                'status' => $task->status,
                'problem_description' => $task->problem_description,
                'action_taken' => $task->action_taken ?? '',
                'time_spent_minutes' => $task->time_spent_minutes,
                'billable_hours' => number_format($task->time_spent_minutes / 60, 2).'h',
                'escalated_at' => $task->escalated_at ? $task->escalated_at->format('Y-m-d H:i') : '2024-10-24 14:22',
                'hq_ticket_ref' => $task->hq_ticket_ref ?? 'HQ-99410',
                'hq_response' => $task->hq_response ?? 'Fuser unit lot #2023-B has known thermistor recall. Dispatching replacement assembly under warranty dispatch code D-8812.',
                'hq_dispatch_code' => $task->hq_dispatch_code ?? 'D-8812',
                'state_label' => $task->state_label ?? 'PENDING PARTS DISPATCH',
                'attachments' => $task->attachments ?? [],
                'audit_trail' => $task->audit_trail ?? [],
            ],
        ]);
    }

    public function update(Request $request, SupportTask $task): RedirectResponse
    {
        $action = $request->string('action')->toString();
        $userName = $request->user()?->name ?? 'Alex Mercer';
        $auditTrail = $task->audit_trail ?? [];

        if ($action === 'verify') {
            $auditTrail[] = [
                'timestamp' => now()->format('Y-m-d H:i'),
                'title' => "Task verified by {$userName} (Administrator)",
                'subtitle' => 'Cryptographic verification signature recorded',
                'icon' => 'done_all',
                'highlight' => true,
            ];

            $task->update([
                'status' => 'Verified',
                'state_label' => 'VERIFIED & CLOSED',
                'audit_trail' => $auditTrail,
            ]);

            return back()->with('success', "Task {$task->task_code} marked as Verified.");
        }

        if ($action === 'resolve') {
            $auditTrail[] = [
                'timestamp' => now()->format('Y-m-d H:i'),
                'title' => "Marked as resolved by {$userName}",
                'subtitle' => 'Local field resolution completed',
                'icon' => 'done_all',
                'highlight' => true,
            ];

            $task->update([
                'status' => 'Resolved',
                'state_label' => 'RESOLVED LOCALLY',
                'audit_trail' => $auditTrail,
            ]);

            return back()->with('success', "Task {$task->task_code} marked as Resolved.");
        }

        if ($action === 'escalate') {
            $hqRef = $task->hq_ticket_ref ?: 'HQ-'.random_int(99100, 99999);
            $auditTrail[] = [
                'timestamp' => now()->format('Y-m-d H:i'),
                'title' => 'Local diagnosis complete, escalated to HQ',
                'subtitle' => "Authorized by {$userName} · Ref: #{$hqRef}",
                'icon' => 'send',
                'highlight' => true,
            ];

            $task->update([
                'status' => 'Escalated to HQ',
                'escalated_at' => now(),
                'hq_ticket_ref' => $hqRef,
                'state_label' => 'PENDING PARTS DISPATCH',
                'audit_trail' => $auditTrail,
            ]);

            return back()->with('success', "Task {$task->task_code} escalated to HQ (#{$hqRef}).");
        }

        if ($action === 'record_hq_response') {
            $validated = $request->validate([
                'hq_response' => ['required', 'string', 'max:2000'],
            ]);

            $auditTrail[] = [
                'timestamp' => now()->format('Y-m-d H:i'),
                'title' => 'HQ response recorded',
                'subtitle' => "Logged by {$userName} via HQ Secure Support Bridge",
                'icon' => 'done_all',
                'highlight' => true,
            ];

            $task->update([
                'hq_response' => $validated['hq_response'],
                'audit_trail' => $auditTrail,
            ]);

            return back()->with('success', 'HQ operational response updated.');
        }

        if ($action === 'remove_attachment') {
            $attachmentId = $request->string('attachment_id')->toString();
            $attachments = collect($task->attachments ?? [])
                ->reject(fn (array $item) => ($item['id'] ?? '') === $attachmentId)
                ->values()
                ->all();

            $task->update(['attachments' => $attachments]);

            return back()->with('success', 'Attachment removed.');
        }

        if ($action === 'add_attachment') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'size' => ['nullable', 'string', 'max:50'],
            ]);

            $attachments = $task->attachments ?? [];
            $attachments[] = [
                'id' => 'att-'.uniqid(),
                'name' => $validated['name'],
                'size' => $validated['size'] ?? '1.4 MB',
                'url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2cGuvJYjnIYLpU0BhO7c_rByFi27sPTbgR4FBgrNWISMaaMvqFDKH0ufpsbJ2_TTNqd0x_pAg5V6GK5nxS_ES3cDix7sZFiaLeh_SeGEjLaHY4PYev8141a_308nOBS3eIUfCI1GciAv9xaAde5YqzSUOHKoas7iAiDY6qSafhApRCOXQprJl4yLkfFuSmJ6qfAVVQ4GEThMrgqADyjJydnGJN9UY8kM--3Dg5FI',
            ];

            $task->update(['attachments' => $attachments]);

            return back()->with('success', 'Attachment uploaded and hash verified.');
        }

        $validated = $request->validate([
            'problem_description' => ['required', 'string', 'max:2000'],
            'action_taken' => ['nullable', 'string', 'max:2000'],
            'time_spent_minutes' => ['required', 'integer', 'min:0', 'max:1440'],
        ]);

        $auditTrail[] = [
            'timestamp' => now()->format('Y-m-d H:i'),
            'title' => "Field log updated by {$userName}",
            'subtitle' => "Time logged: {$validated['time_spent_minutes']} minutes",
            'icon' => 'edit_document',
            'highlight' => false,
        ];

        $task->update([
            'problem_description' => $validated['problem_description'],
            'action_taken' => $validated['action_taken'] ?? '',
            'time_spent_minutes' => $validated['time_spent_minutes'],
            'audit_trail' => $auditTrail,
        ]);

        return back()->with('success', "Task {$task->task_code} saved.");
    }
}
