<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\MaintenanceSchedule;
use App\Models\SupportTask;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Reports/Index', [
            'summary' => [
                'totalTasks' => SupportTask::count(),
                'escalatedTasks' => SupportTask::where('status', 'Escalated to HQ')->count(),
                'resolvedTasks' => SupportTask::whereIn('status', ['Resolved', 'Verified'])->count(),
                'totalAssets' => Asset::count(),
                'overdueMaintenance' => MaintenanceSchedule::where('status', 'Overdue')->count(),
            ],
            'departmentBreakdown' => [
                ['department' => 'Finance', 'tasks' => 18, 'escalations' => 4, 'avgResolutionHours' => '2.1h', 'slaCompliance' => '96.4%'],
                ['department' => 'Logistics', 'tasks' => 11, 'escalations' => 1, 'avgResolutionHours' => '1.8h', 'slaCompliance' => '98.2%'],
                ['department' => 'Engineering', 'tasks' => 9, 'escalations' => 1, 'avgResolutionHours' => '2.6h', 'slaCompliance' => '94.8%'],
                ['department' => 'Legal', 'tasks' => 6, 'escalations' => 2, 'avgResolutionHours' => '3.0h', 'slaCompliance' => '92.1%'],
                ['department' => 'HR', 'tasks' => 4, 'escalations' => 1, 'avgResolutionHours' => '1.5h', 'slaCompliance' => '99.0%'],
            ],
        ]);
    }
}
