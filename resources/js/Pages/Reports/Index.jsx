import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ReportsIndex({ summary = {}, departmentBreakdown = [] }) {
    const { tr, translateDepartment } = useLanguage();

    return (
        <AuthenticatedLayout>
            <Head title={tr('Reports - IT Support Tracker', 'Laporan - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full gap-space-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div>
                        <div className="flex items-center gap-space-xs font-mono-data text-label-sm text-secondary uppercase tracking-wider mb-space-xs">
                            <span>{tr('Analytics', 'Analitik')}</span>
                            <span>/</span>
                            <span>{tr('SLA & Audit Telemetry', 'Telemetri SLA & Audit')}</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            {tr('Operational Reports', 'Laporan Operasi')}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-secondary uppercase">
                            {tr('Total Tasks', 'Jumlah Tugasan')}
                        </span>
                        <div className="font-headline-xl text-headline-xl font-mono-data text-on-surface mt-space-xs">
                            {summary.totalTasks ?? 0}
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-primary uppercase">
                            {tr('Escalated to HQ', 'Dinaikkan ke HQ')}
                        </span>
                        <div className="font-headline-xl text-headline-xl font-mono-data text-primary mt-space-xs">
                            {summary.escalatedTasks ?? 0}
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-secondary uppercase">
                            {tr('Resolved / Verified', 'Selesai / Disahkan')}
                        </span>
                        <div className="font-headline-xl text-headline-xl font-mono-data text-on-surface mt-space-xs">
                            {summary.resolvedTasks ?? 0}
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-secondary uppercase">
                            {tr('Monitored Assets', 'Aset Dipantau')}
                        </span>
                        <div className="font-headline-xl text-headline-xl font-mono-data text-on-surface mt-space-xs">
                            {summary.totalAssets ?? 0}
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
                        <span className="font-label-sm text-label-sm text-secondary uppercase">
                            {tr('Overdue Maint.', 'Penyelenggaraan Tertunggak')}
                        </span>
                        <div className="font-headline-xl text-headline-xl font-mono-data text-error mt-space-xs">
                            {summary.overdueMaintenance ?? 0}
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
                    <div className="p-space-md bg-surface-container-low border-b border-outline-variant">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            {tr('Department SLA & Incident Breakdown', 'Pecahan SLA & Insiden Mengikut Jabatan')}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low h-9 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                                    <th className="px-space-md py-space-xs">{tr('Department', 'Jabatan')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Tasks Logged', 'Tugasan Direkod')}</th>
                                    <th className="px-space-md py-space-xs">{tr('HQ Escalations', 'Eskalasi HQ')}</th>
                                    <th className="px-space-md py-space-xs">
                                        {tr('Avg Resolution Time', 'Purata Masa Penyelesaian')}
                                    </th>
                                    <th className="px-space-md py-space-xs text-right">
                                        {tr('SLA Compliance', 'Pematuhan SLA')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
                                {departmentBreakdown.map((row) => (
                                    <tr key={row.department} className="h-10 hover:bg-surface-container-low/50">
                                        <td className="px-space-md py-space-xs font-medium text-on-surface">
                                            {translateDepartment(row.department)}
                                        </td>
                                        <td className="px-space-md py-space-xs font-mono-data text-secondary">
                                            {row.tasks}
                                        </td>
                                        <td className="px-space-md py-space-xs font-mono-data text-primary font-semibold">
                                            {row.escalations}
                                        </td>
                                        <td className="px-space-md py-space-xs font-mono-data text-secondary">
                                            {row.avgResolutionHours}
                                        </td>
                                        <td className="px-space-md py-space-xs font-mono-data text-on-surface font-semibold text-right">
                                            {row.slaCompliance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
