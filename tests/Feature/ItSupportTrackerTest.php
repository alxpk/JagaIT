<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\KnowledgeBaseArticle;
use App\Models\MaintenanceSchedule;
use App\Models\SupportTask;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ItSupportTrackerTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_renders_metrics_and_tables_for_authenticated_user(): void
    {
        $user = User::factory()->create(['role' => 'Administrator']);
        $asset = Asset::factory()->create([
            'asset_tag' => 'AST-0842',
            'department' => 'Finance',
            'incident_count_30d' => 4,
        ]);
        SupportTask::factory()->create([
            'task_code' => 'T-104',
            'asset_id' => $asset->id,
            'status' => 'Escalated to HQ',
            'escalated_at' => now()->subDays(4),
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('metrics')
            ->has('waitingOnHq', 1)
            ->has('repeatFailureAssets', 1)
        );
    }

    public function test_tasks_index_filters_and_creates_new_support_task(): void
    {
        $user = User::factory()->create(['name' => 'Alex Mercer']);
        $asset = Asset::factory()->create(['asset_tag' => 'AST-0842']);

        SupportTask::factory()->create([
            'task_code' => 'T-142',
            'department' => 'Logistics',
            'category' => 'Network',
            'status' => 'Open',
            'asset_id' => $asset->id,
        ]);
        SupportTask::factory()->create([
            'task_code' => 'T-140',
            'department' => 'Legal',
            'category' => 'Account',
            'status' => 'Escalated to HQ',
            'asset_id' => $asset->id,
        ]);

        $this->actingAs($user)
            ->get(route('tasks.index', ['status' => 'Escalated to HQ']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tasks/Index')
                ->has('tasks', 1)
                ->where('tasks.0.task_code', 'T-140')
            );

        $storeResponse = $this->actingAs($user)->post(route('tasks.store'), [
            'requester_name' => 'Eleanor Vance',
            'department' => 'Finance',
            'category' => 'Printer',
            'asset_id' => $asset->id,
            'problem_description' => 'Fuser error 50.2 after cold restart',
            'action_taken' => 'Cleaned contacts',
            'time_spent_minutes' => 45,
        ]);

        $createdTask = SupportTask::where('requester_name', 'Eleanor Vance')->firstOrFail();
        $storeResponse->assertRedirect(route('tasks.show', $createdTask));
        $this->assertSame('Open', $createdTask->status);
        $this->assertSame(45, $createdTask->time_spent_minutes);
    }

    public function test_task_detail_supports_escalation_resolution_and_verification(): void
    {
        $user = User::factory()->create(['name' => 'Alex Mercer', 'role' => 'Administrator']);
        $task = SupportTask::factory()->create([
            'task_code' => 'T-000',
            'status' => 'Open',
        ]);

        $this->actingAs($user)
            ->get(route('tasks.show', $task))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tasks/Show')
                ->where('task.task_code', 'T-000')
            );

        $this->actingAs($user)
            ->patch(route('tasks.update', $task), ['action' => 'escalate'])
            ->assertRedirect();

        $this->assertSame('Escalated to HQ', $task->fresh()->status);
        $this->assertNotNull($task->fresh()->escalated_at);

        $this->actingAs($user)
            ->patch(route('tasks.update', $task), ['action' => 'resolve'])
            ->assertRedirect();

        $this->assertSame('Resolved', $task->fresh()->status);

        $this->actingAs($user)
            ->patch(route('tasks.update', $task), ['action' => 'verify'])
            ->assertRedirect();

        $this->assertSame('Verified', $task->fresh()->status);
    }

    public function test_asset_detail_and_maintenance_schedule_recalculation(): void
    {
        $user = User::factory()->create();
        $asset = Asset::factory()->create(['asset_tag' => 'AST-0842']);
        $schedule = MaintenanceSchedule::factory()->create([
            'asset_id' => $asset->id,
            'department' => 'Finance',
            'asset_type' => 'Printer',
            'repeat_interval_days' => 90,
            'last_done_date' => '2024-07-12',
            'next_due_date' => '2024-10-10',
            'status' => 'Overdue',
        ]);

        $this->actingAs($user)
            ->get(route('assets.show', $asset))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Assets/Show')
                ->where('asset.asset_tag', 'AST-0842')
            );

        $this->actingAs($user)
            ->patch(route('maintenance.mark-done', $schedule))
            ->assertRedirect();

        $schedule->refresh();
        $this->assertSame('Scheduled', $schedule->status);
        $this->assertSame(now()->toDateString(), $schedule->last_done_date->toDateString());
        $this->assertSame(now()->addDays(90)->toDateString(), $schedule->next_due_date->toDateString());
    }

    public function test_knowledge_base_filtering_creation_and_helpful_counter(): void
    {
        $user = User::factory()->create(['name' => 'J. Doe']);
        $article = KnowledgeBaseArticle::factory()->create([
            'doc_id' => 'KB-4091',
            'title' => 'Resolving HP M600 Series Fuser Error 50.2',
            'category' => 'Printer',
            'helpful_count' => 42,
        ]);

        $this->actingAs($user)
            ->get(route('knowledge-base.index', ['category' => 'printer']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('KnowledgeBase/Index')
                ->has('articles', 1)
                ->where('articles.0.doc_id', 'KB-4091')
            );

        $this->actingAs($user)
            ->patch(route('knowledge-base.update', $article), ['action' => 'helpful'])
            ->assertRedirect();

        $this->assertSame(43, $article->fresh()->helpful_count);

        $this->actingAs($user)
            ->post(route('knowledge-base.store'), [
                'title' => 'Switch Port Recovery Procedure',
                'category' => 'Network',
                'summary' => 'Resetting err-disabled ports on Catalyst switches.',
                'problem_description' => 'Port enters err-disable state due to BPDU guard.',
                'steps' => ['Verify port status', 'Issue shut and no shut'],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('knowledge_base_articles', [
            'title' => 'Switch Port Recovery Procedure',
            'category' => 'Network',
        ]);
    }

    public function test_administrator_login_page_authenticates_admin_and_rejects_staff(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@department.gov',
            'role' => 'Administrator',
        ]);
        $staff = User::factory()->create([
            'email' => 'staff@department.gov',
            'role' => 'Staff',
        ]);

        $this->get(route('admin.login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/AdminLogin'));

        $this->post(route('admin.login.store'), [
            'email' => $staff->email,
            'password' => 'password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();

        $this->post(route('admin.login.store'), [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($admin);
    }
}
