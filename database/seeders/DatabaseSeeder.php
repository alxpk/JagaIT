<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\KnowledgeBaseArticle;
use App\Models\MaintenanceSchedule;
use App\Models\SupportTask;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $alex = User::updateOrCreate(
            ['email' => 'alex.mercer@department.gov'],
            [
                'name' => 'Alex Mercer',
                'role' => 'Staff',
                'department' => 'IT Operations',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@department.gov'],
            [
                'name' => 'Alex Mercer',
                'role' => 'Administrator',
                'department' => 'HQ Operations',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $ast0842 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0842'],
            [
                'uid_code' => '98104-E2',
                'asset_class' => 'Peripheral',
                'type' => 'Printer',
                'model' => 'HP LaserJet Enterprise M608dn',
                'serial_number' => 'CNB2K98104',
                'department' => 'Finance',
                'location' => 'Building B, Floor 2, Room 204',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-10-14',
                'warranty_tier' => 'Active · Tier-1 Enterprise Care Pack',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.88.204',
                'mac_address' => 'B4:2E:99:A1:0C',
                'toner_level' => 78,
                'total_page_count' => 148920,
                'image_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqYdAWXIrAYQVyB9VSY4icgYH2nKtySmVVIvM5OCFHXFhuGNfIOjHzS4nqPbDkhDkmCVzl3iU5u9QbhUcqgJJN2wdacdSGo0qIymjGY0N5OppFC_yBgIU3YzBJktmPL5Dr2cnWPM1KBtCgzwYdvxCj8zLelxCELYgtCbTbbYj2fkety3f4InlulilFtpXGh0Go4xmNEBAU1dQzIYqEmFcB1uzCC6Uw412tNMCDtKzQ',
                'incident_count_30d' => 4,
            ]
        );

        $ast1109 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-1109'],
            [
                'uid_code' => '44120-R1',
                'asset_class' => 'Peripheral',
                'type' => 'Printer',
                'model' => 'HP LaserJet Enterprise M609x',
                'serial_number' => 'CNB9L44120',
                'department' => 'Registry',
                'location' => 'Building A, Floor 1, Room 108',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-06-30',
                'warranty_tier' => 'Active · Tier-1 Enterprise Care Pack',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.12.108',
                'mac_address' => 'A4:5E:60:C2:11',
                'toner_level' => 54,
                'total_page_count' => 92410,
                'incident_count_30d' => 3,
            ]
        );

        $ast0518 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0518'],
            [
                'uid_code' => '51802-P4',
                'asset_class' => 'Infrastructure',
                'type' => 'Network switch',
                'model' => 'Cisco Catalyst 9300-48P',
                'serial_number' => 'FCW2245G09Z',
                'department' => 'Operations',
                'location' => 'Building C, Floor 3, IDF-3B',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2027-03-15',
                'warranty_tier' => 'Active · SmartNet Total Care',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.10.3.2',
                'mac_address' => '00:26:99:FF:18',
                'toner_level' => 92,
                'total_page_count' => 0,
                'incident_count_30d' => 3,
            ]
        );

        $ast0412 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0412'],
            [
                'uid_code' => '41209-N1',
                'asset_class' => 'Infrastructure',
                'type' => 'Network switch',
                'model' => 'Cisco Catalyst 9200L-24P',
                'serial_number' => 'JAE23110412',
                'department' => 'Logistics',
                'location' => 'Building A, Floor 2, Comms Room 2F',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-11-20',
                'warranty_tier' => 'Active · SmartNet Total Care',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.22.12',
                'mac_address' => '68:EF:BD:04:12',
                'toner_level' => 100,
                'total_page_count' => 0,
                'incident_count_30d' => 1,
            ]
        );

        $ast0911 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0911'],
            [
                'uid_code' => '91100-L2',
                'asset_class' => 'Peripheral',
                'type' => 'Printer',
                'model' => 'HP Color LaserJet Managed E65150',
                'serial_number' => 'CNB7H09112',
                'department' => 'Legal',
                'location' => 'Building B, Floor 4, Room 410',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-09-01',
                'warranty_tier' => 'Active · Tier-1 Enterprise Care Pack',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.44.91',
                'mac_address' => '3C:D9:2B:09:11',
                'toner_level' => 64,
                'total_page_count' => 84320,
                'incident_count_30d' => 2,
            ]
        );

        $ast1204 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-1204'],
            [
                'uid_code' => '12048-W8',
                'asset_class' => 'Endpoint',
                'type' => 'Workstation',
                'model' => 'Dell Precision 5860 Tower',
                'serial_number' => 'DLL5860CAD4',
                'department' => 'Engineering',
                'location' => 'Building D, Floor 1, CAD Bay 4',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2027-01-19',
                'warranty_tier' => 'Active · ProSupport Plus',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.60.104',
                'mac_address' => 'F8:B1:56:12:04',
                'toner_level' => 95,
                'total_page_count' => 0,
                'incident_count_30d' => 1,
            ]
        );

        $ast0331 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0331'],
            [
                'uid_code' => '33105-S1',
                'asset_class' => 'Infrastructure',
                'type' => 'Server',
                'model' => 'Palo Alto PA-3220 VPN Concentrator',
                'serial_number' => 'PA3220HR331',
                'department' => 'HR',
                'location' => 'DC-1, Rack B04, U18',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-12-31',
                'warranty_tier' => 'Active · Premium Support',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.1.33',
                'mac_address' => '00:1B:17:03:31',
                'toner_level' => 100,
                'total_page_count' => 0,
                'incident_count_30d' => 1,
            ]
        );

        $ast0319 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0319'],
            [
                'uid_code' => '31907-W2',
                'asset_class' => 'Endpoint',
                'type' => 'Workstation',
                'model' => 'HP Z4 G5 Workstation',
                'serial_number' => 'MXL3190Z4G5',
                'department' => 'Engineering',
                'location' => 'Building D, Floor 2, Lab 201',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2026-08-15',
                'warranty_tier' => 'Active · Tier-1 Enterprise Care Pack',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.60.19',
                'mac_address' => 'C8:CB:B8:03:19',
                'toner_level' => 88,
                'total_page_count' => 0,
                'incident_count_30d' => 1,
            ]
        );

        $ast1044 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-1044'],
            [
                'uid_code' => '10442-S4',
                'asset_class' => 'Infrastructure',
                'type' => 'Server',
                'model' => 'HPE ProLiant DL380 Gen11',
                'serial_number' => 'USE41044HR9',
                'department' => 'HR',
                'location' => 'DC-1, Rack A02, U10',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2027-05-18',
                'warranty_tier' => 'Active · HPE Pointnext Complete Care',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.2.44',
                'mac_address' => '94:40:C9:10:44',
                'toner_level' => 100,
                'total_page_count' => 0,
                'incident_count_30d' => 0,
            ]
        );

        $ast0522 = Asset::updateOrCreate(
            ['asset_tag' => 'AST-0522'],
            [
                'uid_code' => '52208-N6',
                'asset_class' => 'Infrastructure',
                'type' => 'Network switch',
                'model' => 'Aruba CX 6300M 48G',
                'serial_number' => 'SG2Z0522LOG',
                'department' => 'Logistics',
                'location' => 'Warehouse Annex, MDF-1',
                'operational_status' => 'In use',
                'warranty_expires_at' => '2027-09-02',
                'warranty_tier' => 'Active · Foundation Care 24x7',
                'hardware_state' => 'ONLINE',
                'ip_address' => '10.14.30.22',
                'mac_address' => '20:4C:03:05:22',
                'toner_level' => 100,
                'total_page_count' => 0,
                'incident_count_30d' => 0,
            ]
        );

        // Task T-000 (Featured Task Detail & Escalation)
        $taskT000 = SupportTask::updateOrCreate(
            ['task_code' => 'T-000'],
            [
                'reference_code' => '0842-X',
                'sla_tier' => 'Tier 3',
                'metadata_classification' => 'C-4',
                'incident_at' => '2024-10-24 09:42:00',
                'requester_name' => 'Eleanor Vance',
                'department' => 'Finance',
                'category' => 'Printer',
                'asset_id' => $ast0842->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Escalated to HQ',
                'problem_description' => 'Printer constantly reporting fuser assembly error 50.2 after cold restart. Replaced roller kit locally, error persists.',
                'action_taken' => 'Performed power cycle, firmware cold check, and cleaned contacts. Contacted field support.',
                'time_spent_minutes' => 45,
                'escalated_at' => '2024-10-24 14:22:00',
                'hq_ticket_ref' => 'HQ-99410',
                'hq_response' => 'Fuser unit lot #2023-B has known thermistor recall. Dispatching replacement assembly under warranty dispatch code D-8812.',
                'hq_dispatch_code' => 'D-8812',
                'state_label' => 'PENDING PARTS DISPATCH',
                'attachments' => [
                    [
                        'id' => 'att-1',
                        'name' => 'error_code_50_2_display.jpg',
                        'size' => '1.8 MB',
                        'url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2cGuvJYjnIYLpU0BhO7c_rByFi27sPTbgR4FBgrNWISMaaMvqFDKH0ufpsbJ2_TTNqd0x_pAg5V6GK5nxS_ES3cDix7sZFiaLeh_SeGEjLaHY4PYev8141a_308nOBS3eIUfCI1GciAv9xaAde5YqzSUOHKoas7iAiDY6qSafhApRCOXQprJl4yLkfFuSmJ6qfAVVQ4GEThMrgqADyjJydnGJN9UY8kM--3Dg5FI',
                    ],
                    [
                        'id' => 'att-2',
                        'name' => 'fuser_contacts_photo.png',
                        'size' => '3.2 MB',
                        'url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWg5FOP4-cC-5QqgOcS9nKupTFk0MremCLpqkBai4y7EvZwPzPRY123lzcwaaOu2Bg1lw49s5OvbHQxGa0LFojXXSyzGQK_UZc94N4P_OM7bVgw7M8YhYYc5UYCLGOwqz-6KLgtRHYeqRT4EjAFBuLvO1s81hux-ZYNprn5wxNGyEWcweVx_977bCuP2EPuo3lGbToMarzk4-1IQS6Wh4kHY9hkGyMHVMOcoH-8B_U',
                    ],
                ],
                'audit_trail' => [
                    [
                        'timestamp' => '2024-10-24 10:15',
                        'title' => 'Logged by J. Doe (Staff)',
                        'subtitle' => 'Initial ticket generated from desk intake',
                        'icon' => 'edit_document',
                        'highlight' => false,
                    ],
                    [
                        'timestamp' => '2024-10-24 11:30',
                        'title' => 'Local diagnosis complete, escalated to HQ',
                        'subtitle' => 'Authorized by J. Doe (Staff) · Ref: #HQ-99410',
                        'icon' => 'send',
                        'highlight' => false,
                    ],
                    [
                        'timestamp' => '2024-10-24 14:22',
                        'title' => 'HQ response received',
                        'subtitle' => 'Dispatched from HQ Operations Engineer (K. Vance)',
                        'icon' => 'done_all',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        // Task List rows from Screen 3
        SupportTask::updateOrCreate(
            ['task_code' => 'T-142'],
            [
                'reference_code' => '0412-A',
                'incident_at' => '2025-05-18 08:30:00',
                'requester_name' => 'Marcus Cole',
                'department' => 'Logistics',
                'category' => 'Network',
                'asset_id' => $ast0412->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Open',
                'problem_description' => 'Network switch port offline in 2F comms room',
                'action_taken' => 'Initial port diagnostics queued for inspection.',
                'time_spent_minutes' => 20,
                'state_label' => 'AWAITING FIELD DISPATCH',
                'attachments' => [],
                'audit_trail' => [
                    [
                        'timestamp' => '2025-05-18 08:30',
                        'title' => 'Logged by J. Doe (Staff)',
                        'subtitle' => 'Initial ticket generated from desk intake',
                        'icon' => 'edit_document',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        SupportTask::updateOrCreate(
            ['task_code' => 'T-141'],
            [
                'reference_code' => '0842-B',
                'incident_at' => '2025-05-18 09:15:00',
                'requester_name' => 'Eleanor Vance',
                'department' => 'Finance',
                'category' => 'Printer',
                'asset_id' => $ast0842->id,
                'technician_id' => $alex->id,
                'technician_name' => 'M. Smith',
                'status' => 'In progress',
                'problem_description' => 'Office printer roller jam and error code 50.4',
                'action_taken' => 'Cleared tray 2 paper path; inspecting fuser drive gear.',
                'time_spent_minutes' => 35,
                'state_label' => 'ACTIVE LOCAL TRIAGE',
                'attachments' => [],
                'audit_trail' => [
                    [
                        'timestamp' => '2025-05-18 09:15',
                        'title' => 'Logged by M. Smith (Staff)',
                        'subtitle' => 'Assigned to local printer maintenance queue',
                        'icon' => 'edit_document',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        $taskT140 = SupportTask::updateOrCreate(
            ['task_code' => 'T-140'],
            [
                'reference_code' => '0911-C',
                'incident_at' => '2025-05-17 11:20:00',
                'requester_name' => 'Helena Sterling',
                'department' => 'Legal',
                'category' => 'Account',
                'asset_id' => $ast0911->id,
                'technician_id' => $alex->id,
                'technician_name' => 'A. Patel',
                'status' => 'Escalated to HQ',
                'problem_description' => 'Active Directory account locked after badge reissue',
                'action_taken' => 'Verified smartcard PKI thumbprint; escalated to HQ Identity Ops.',
                'time_spent_minutes' => 40,
                'escalated_at' => '2025-05-17 13:05:00',
                'hq_ticket_ref' => 'HQ-99502',
                'hq_response' => 'Cleared stale Kerberos ticket cache on primary domain controller.',
                'hq_dispatch_code' => 'ID-4401',
                'state_label' => 'HQ DIRECTORY SYNC',
                'attachments' => [],
                'audit_trail' => [
                    [
                        'timestamp' => '2025-05-17 11:20',
                        'title' => 'Logged by A. Patel (Staff)',
                        'subtitle' => 'Initial ticket generated from desk intake',
                        'icon' => 'edit_document',
                        'highlight' => false,
                    ],
                    [
                        'timestamp' => '2025-05-17 13:05',
                        'title' => 'Escalated to HQ Identity Operations',
                        'subtitle' => 'Authorized by A. Patel (Staff) · Ref: #HQ-99502',
                        'icon' => 'send',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        SupportTask::updateOrCreate(
            ['task_code' => 'T-139'],
            [
                'reference_code' => '1204-D',
                'incident_at' => '2025-05-17 14:10:00',
                'requester_name' => 'David Kim',
                'department' => 'Engineering',
                'category' => 'Hardware',
                'asset_id' => $ast1204->id,
                'technician_id' => $alex->id,
                'technician_name' => 'R. Vance',
                'status' => 'Resolved',
                'problem_description' => 'Workstation thermal throttling on CAD desk',
                'action_taken' => 'Cleaned heatsink assembly, reapplied thermal compound, verified fan curve.',
                'time_spent_minutes' => 55,
                'state_label' => 'RESOLVED LOCALLY',
                'attachments' => [],
                'audit_trail' => [
                    [
                        'timestamp' => '2025-05-17 15:05',
                        'title' => 'Marked as Resolved by R. Vance',
                        'subtitle' => 'Thermal stress test passed at 72°C peak',
                        'icon' => 'done_all',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        $taskT138 = SupportTask::updateOrCreate(
            ['task_code' => 'T-138'],
            [
                'reference_code' => '0331-E',
                'incident_at' => '2025-05-16 10:00:00',
                'requester_name' => 'Sarah Jenkins',
                'department' => 'HR',
                'category' => 'Network',
                'asset_id' => $ast0331->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Verified',
                'problem_description' => 'VPN gateway handshake timeout',
                'action_taken' => 'Restarted IKEv2 daemon and synchronized MTU parameters.',
                'time_spent_minutes' => 30,
                'state_label' => 'VERIFIED & CLOSED',
                'attachments' => [],
                'audit_trail' => [
                    [
                        'timestamp' => '2025-05-16 11:15',
                        'title' => 'Verified by Administrator',
                        'subtitle' => 'Tunnel stability confirmed over 24h window',
                        'icon' => 'done_all',
                        'highlight' => true,
                    ],
                ],
            ]
        );

        // Waiting on HQ tasks from Dashboard (T-104, T-098, T-092)
        SupportTask::updateOrCreate(
            ['task_code' => 'T-104'],
            [
                'reference_code' => '0842-F',
                'incident_at' => '2025-05-12 09:00:00',
                'requester_name' => 'Eleanor Vance',
                'department' => 'Finance',
                'category' => 'Printer',
                'asset_id' => $ast0842->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Escalated to HQ',
                'problem_description' => 'Fuser error 50.2 after cold restart on Finance printer AST-0842',
                'action_taken' => 'Cleaned contacts, escalated to HQ for fuser kit replacement #RM2-1256',
                'time_spent_minutes' => 45,
                'escalated_at' => '2025-05-12 14:00:00',
                'hq_ticket_ref' => 'HQ-99380',
                'state_label' => 'WAITING ON HQ DISPATCH',
                'attachments' => [],
                'audit_trail' => [],
            ]
        );

        SupportTask::updateOrCreate(
            ['task_code' => 'T-098'],
            [
                'reference_code' => '1109-G',
                'incident_at' => '2025-05-13 10:30:00',
                'requester_name' => 'thomas Wright',
                'department' => 'Registry',
                'category' => 'Printer',
                'asset_id' => $ast1109->id,
                'technician_id' => $alex->id,
                'technician_name' => 'M. Smith',
                'status' => 'Escalated to HQ',
                'problem_description' => 'Formatter board parity error during high-volume batch print',
                'action_taken' => 'Reseated DIMM module; escalated to HQ hardware warranty queue.',
                'time_spent_minutes' => 50,
                'escalated_at' => '2025-05-13 15:20:00',
                'hq_ticket_ref' => 'HQ-99395',
                'state_label' => 'WAITING ON HQ DISPATCH',
                'attachments' => [],
                'audit_trail' => [],
            ]
        );

        SupportTask::updateOrCreate(
            ['task_code' => 'T-092'],
            [
                'reference_code' => '0518-H',
                'incident_at' => '2025-05-14 08:45:00',
                'requester_name' => 'Nadia Chen',
                'department' => 'Operations',
                'category' => 'Network',
                'asset_id' => $ast0518->id,
                'technician_id' => $alex->id,
                'technician_name' => 'A. Patel',
                'status' => 'Escalated to HQ',
                'problem_description' => 'PoE controller fault on ports Gi1/0/25-32',
                'action_taken' => 'Collected crashinfo log and escalated to HQ Network Core team.',
                'time_spent_minutes' => 60,
                'escalated_at' => '2025-05-14 11:10:00',
                'hq_ticket_ref' => 'HQ-99401',
                'state_label' => 'WAITING ON HQ DISPATCH',
                'attachments' => [],
                'audit_trail' => [],
            ]
        );

        // Historical tasks for AST-0842 from Screen 5
        SupportTask::updateOrCreate(
            ['task_code' => 'T-042'],
            [
                'reference_code' => '0842-J',
                'incident_at' => '2025-01-08 13:20:00',
                'requester_name' => 'Eleanor Vance',
                'department' => 'Finance',
                'category' => 'Printer',
                'asset_id' => $ast0842->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Resolved',
                'problem_description' => 'Paper pick-up roller squeak & multi-feed jam',
                'action_taken' => 'Replaced feed rollers with kit #4; cleaned registration assembly sensors',
                'time_spent_minutes' => 40,
                'state_label' => 'RESOLVED LOCALLY',
                'attachments' => [],
                'audit_trail' => [],
            ]
        );

        SupportTask::updateOrCreate(
            ['task_code' => 'T-019'],
            [
                'reference_code' => '0842-K',
                'incident_at' => '2024-10-24 08:00:00',
                'requester_name' => 'Eleanor Vance',
                'department' => 'Finance',
                'category' => 'Printer',
                'asset_id' => $ast0842->id,
                'technician_id' => $alex->id,
                'technician_name' => 'J. Doe',
                'status' => 'Verified',
                'problem_description' => 'Initial network setup & IP assignment',
                'action_taken' => 'Assigned static IP, applied SSL certificate, and pushed PCL6 drivers via GPO',
                'time_spent_minutes' => 30,
                'state_label' => 'VERIFIED & CLOSED',
                'attachments' => [],
                'audit_trail' => [],
            ]
        );

        // Maintenance Schedules from Screen 6
        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $ast0842->id],
            [
                'department' => 'Finance',
                'asset_type' => 'Printer',
                'repeat_interval_days' => 90,
                'last_done_date' => '2024-07-12',
                'next_due_date' => '2024-10-10',
                'status' => 'Overdue',
                'technician_note' => 'By Dispatch Tech #12',
                'maintenance_note' => 'Inspection & roller cleaning required',
            ]
        );

        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $ast0319->id],
            [
                'department' => 'Engineering',
                'asset_type' => 'Workstation',
                'repeat_interval_days' => 30,
                'last_done_date' => '2024-09-24',
                'next_due_date' => '2024-10-24',
                'status' => 'Due in 3 days',
                'technician_note' => 'By Dispatch Tech #08',
                'maintenance_note' => 'Thermal filter & fan inspection',
            ]
        );

        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $ast1044->id],
            [
                'department' => 'HR',
                'asset_type' => 'Server',
                'repeat_interval_days' => 180,
                'last_done_date' => '2024-05-18',
                'next_due_date' => '2024-11-14',
                'status' => 'Scheduled',
                'technician_note' => 'By Systems Eng #03',
                'maintenance_note' => 'RAID battery & iLO firmware audit',
            ]
        );

        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $ast0522->id],
            [
                'department' => 'Logistics',
                'asset_type' => 'Network switch',
                'repeat_interval_days' => 60,
                'last_done_date' => '2024-09-02',
                'next_due_date' => '2024-11-01',
                'status' => 'Scheduled',
                'technician_note' => 'By NetOps #05',
                'maintenance_note' => 'Optics DOM telemetry & config backup',
            ]
        );

        MaintenanceSchedule::updateOrCreate(
            ['asset_id' => $ast0911->id],
            [
                'department' => 'Legal',
                'asset_type' => 'Printer',
                'repeat_interval_days' => 90,
                'last_done_date' => '2024-08-30',
                'next_due_date' => '2024-11-28',
                'status' => 'Scheduled',
                'technician_note' => 'By Dispatch Tech #12',
                'maintenance_note' => 'Transfer belt & fuser preventative check',
            ]
        );

        // Knowledge Base Articles from Screen 7
        KnowledgeBaseArticle::updateOrCreate(
            ['doc_id' => 'KB-4091'],
            [
                'title' => 'Resolving HP M600 Series Fuser Error 50.2 & Thermistor Fault',
                'category' => 'Printer',
                'author_name' => 'J. Doe',
                'is_verified' => true,
                'status' => 'Verified',
                'source_task_id' => $taskT000->id,
                'summary' => 'Fuser cold start errors on M608/M609 units require thermistor recall verification prior to assembly replacement.',
                'problem_description' => 'The printer enters a repetitive error cycle displaying code 50.2 Fuser Error immediately upon initialization or cold boot. Standard power cycling or reseating the roller kit does not clear the persistent error flag.',
                'steps' => [
                    'Isolate printer from power network and discharge residual capacitance (30 seconds).',
                    'Inspect fuser serial lot number located on the underside barcode label.',
                    'Verify if lot belongs to recall batch #2023-B via HQ portal cross-reference.',
                    'If batch matches, do not perform local contact grinding. Request warranty dispatch code D-8812.',
                    'Install replacement unit, apply cold boot reset key combo [Cancel + Select], and print test configuration sheet.',
                ],
                'helpful_count' => 42,
                'published_date_label' => 'Oct 24, 2024',
            ]
        );

        KnowledgeBaseArticle::updateOrCreate(
            ['doc_id' => 'SEC-POL-09'],
            [
                'title' => 'Active Directory Account Lockout Resolution Workflow',
                'category' => 'Account',
                'author_name' => 'A. Patel',
                'is_verified' => true,
                'status' => 'Verified',
                'source_task_id' => $taskT140->id,
                'summary' => 'Step-by-step unfreeze procedure after smartcard certificate sync mismatch.',
                'problem_description' => 'Staff Active Directory accounts repeatedly lock within 15 minutes of PIV/smartcard badge reissue due to cached Kerberos tickets and stale certificate thumbprint bindings on local workstations.',
                'steps' => [
                    'Verify user identity and inspect lockout source DC in Security Event ID 4740.',
                    'Purge cached credentials on endpoint via klist purge and certutil -scinfo.',
                    'Confirm new smartcard X.509 certificate serial is replicated to HQ Identity Directory.',
                    'Unlock account in Active Directory Users and Computers and force group policy update.',
                ],
                'helpful_count' => 28,
                'published_date_label' => 'Oct 18, 2024',
            ]
        );

        KnowledgeBaseArticle::updateOrCreate(
            ['doc_id' => 'NET-GW-33'],
            [
                'title' => 'VPN Gateway Handshake Timeout on Remote Laptops',
                'category' => 'Network',
                'author_name' => 'M. Smith',
                'is_verified' => true,
                'status' => 'Verified',
                'source_task_id' => $taskT138->id,
                'summary' => 'Resolving IKEv2 daemon desynchronization on staff endpoint clients.',
                'problem_description' => 'Remote department laptops fail Phase-2 IPSec negotiation against the HQ concentrator with IKEv2 handshake timeout errors when roaming across cellular or high-latency links.',
                'steps' => [
                    'Verify endpoint UDP port 500 and 4500 reachability to HQ gateway.',
                    'Set virtual tunnel interface MTU to 1380 bytes to prevent fragmented IKEv2 packets.',
                    'Restart local IPSec Policy Agent service and flush DNS resolver cache.',
                    'Initiate VPN connection and verify Security Association (SA) establishment.',
                ],
                'helpful_count' => 19,
                'published_date_label' => 'Oct 12, 2024',
            ]
        );
    }
}
