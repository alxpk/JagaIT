import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function MaintenanceIndex({ schedules = [], filters = {}, metrics = {} }) {
    const { tr, translateStatus, translateDepartment } = useLanguage();
    const [status, setStatus] = useState(filters.status || 'all');
    const [department, setDepartment] = useState(filters.department || 'all');
    const [assetType, setAssetType] = useState(filters.asset_type || 'all');
    const [showModal, setShowModal] = useState(false);
    const [completedIds, setCompletedIds] = useState({});

    const { data, setData, post, processing, reset } = useForm({
        asset_tag: '',
        department: 'Engineering',
        repeat_interval_days: 90,
    });

    const handleApplyFilters = () => {
        router.get(
            route('maintenance.index'),
            {
                status,
                department,
                asset_type: assetType,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleResetFilters = () => {
        setStatus('all');
        setDepartment('all');
        setAssetType('all');
        router.get(route('maintenance.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handleMarkDone = (scheduleId) => {
        setCompletedIds((prev) => ({ ...prev, [scheduleId]: true }));
        router.patch(
            route('maintenance.mark-done', scheduleId),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setTimeout(() => {
                        setCompletedIds((prev) => ({ ...prev, [scheduleId]: false }));
                    }, 1800);
                },
            }
        );
    };

    const handleExportCsv = () => {
        const rows = [
            ['Asset Tag', 'Department', 'Repeat Every', 'Last Done', 'Next Due', 'Status'],
            ...schedules.map((s) => [
                s.asset_tag,
                s.department,
                s.repeat_label,
                s.last_done_date,
                s.next_due_date,
                s.status,
            ]),
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'maintenance-schedules.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const submitNewSchedule = (e) => {
        e.preventDefault();
        post(route('maintenance.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={tr('Maintenance Overview - IT Support Tracker', 'Ringkasan Penyelenggaraan - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full gap-space-lg">
                {/* Operational Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs font-mono-data text-label-sm text-secondary uppercase tracking-wider mb-space-xs">
                            <span>{tr('Lifecycle Operations', 'Operasi Kitar Hayat')}</span>
                            <span className="text-outline">/</span>
                            <span>{tr('Preventative Servicing', 'Servis Pencegahan')}</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            {tr('Maintenance Overview', 'Ringkasan Penyelenggaraan')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="h-8 px-space-md rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-space-xs shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                file_download
                            </span>
                            {tr('Export CSV', 'Eksport CSV')}
                        </button>
                        <button
                            id="add-schedule-btn"
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="h-8 px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-colors flex items-center gap-space-xs shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            {tr('Add schedule', 'Tambah jadual')}
                        </button>
                    </div>
                </div>

                {/* Telemetry Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    {/* Card 1: Overdue */}
                    <div className="rounded bg-surface-container-low border-2 border-primary-container p-space-md flex flex-col justify-between relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md text-primary-container uppercase tracking-wide font-semibold">
                                {tr('Overdue', 'Tertunggak')}
                            </span>
                            <span className="material-symbols-outlined text-primary-container text-[20px]">
                                warning
                            </span>
                        </div>
                        <div className="mt-space-md flex items-baseline gap-space-sm">
                            <span className="font-mono-data text-headline-xl font-bold text-primary-container">
                                {metrics?.overdue ?? '04'}
                            </span>
                            <span className="font-label-sm text-label-sm text-primary-container opacity-80">
                                {tr('Critical action required', 'Tindakan kritikal diperlukan')}
                            </span>
                        </div>
                        <div className="mt-space-sm w-full bg-primary-fixed h-1 rounded-full overflow-hidden">
                            <div className="bg-primary-container h-full w-[35%]"></div>
                        </div>
                    </div>

                    {/* Card 2: Due in 7 Days */}
                    <div className="rounded bg-surface-container-lowest border border-outline-variant p-space-md flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md text-secondary uppercase tracking-wide font-medium">
                                {tr('Due in next 7 days', 'Perlu dalam 7 hari akan datang')}
                            </span>
                            <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
                        </div>
                        <div className="mt-space-md flex items-baseline gap-space-sm">
                            <span className="font-mono-data text-headline-xl font-semibold text-on-surface">
                                {metrics?.dueNext7Days ?? '08'}
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary">
                                {tr('Awaiting technician queue', 'Menunggu giliran juruteknik')}
                            </span>
                        </div>
                        <div className="mt-space-sm w-full bg-surface-container h-1 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full w-[22%]"></div>
                        </div>
                    </div>

                    {/* Card 3: Scheduled in total */}
                    <div className="rounded bg-surface-container-lowest border border-outline-variant p-space-md flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md text-secondary uppercase tracking-wide font-medium">
                                {tr('Scheduled in total', 'Jumlah dijadualkan')}
                            </span>
                            <span className="material-symbols-outlined text-secondary text-[20px]">
                                event_repeat
                            </span>
                        </div>
                        <div className="mt-space-md flex items-baseline gap-space-sm">
                            <span className="font-mono-data text-headline-xl font-semibold text-on-surface">
                                {metrics?.scheduledTotal ?? '36'}
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary">
                                {tr('Monitored hardware endpoints', 'Titik akhir perkakasan dipantau')}
                            </span>
                        </div>
                        <div className="mt-space-sm w-full bg-surface-container h-1 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full w-[100%]"></div>
                        </div>
                    </div>
                </div>

                {/* Filtration Bar Control Panel */}
                <div className="rounded bg-surface-container-low border border-outline-variant p-space-md flex flex-wrap items-center justify-between gap-space-md shadow-sm">
                    <div className="flex flex-wrap items-center gap-space-md flex-1 min-w-[320px]">
                        {/* Status Filter */}
                        <div className="flex flex-col gap-space-xs min-w-[170px]">
                            <label className="font-label-sm text-label-sm text-secondary" htmlFor="filter-status">
                                {tr('Status', 'Status')}
                            </label>
                            <div className="relative">
                                <select
                                    id="filter-status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-8 pl-space-sm pr-8 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer transition-colors"
                                >
                                    <option value="all">{tr('All statuses', 'Semua status')}</option>
                                    <option value="overdue">{tr('Overdue', 'Tertunggak')}</option>
                                    <option value="due-soon">{tr('Due soon', 'Hampir tamat tempoh')}</option>
                                    <option value="upcoming">{tr('Upcoming', 'Akan datang')}</option>
                                    <option value="up-to-date">{tr('Up to date', 'Terkini')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-secondary pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Department Filter */}
                        <div className="flex flex-col gap-space-xs min-w-[170px]">
                            <label className="font-label-sm text-label-sm text-secondary" htmlFor="filter-dept">
                                {tr('Department', 'Jabatan')}
                            </label>
                            <div className="relative">
                                <select
                                    id="filter-dept"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full h-8 pl-space-sm pr-8 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer transition-colors"
                                >
                                    <option value="all">{tr('All departments', 'Semua jabatan')}</option>
                                    <option value="finance">{tr('Finance', 'Kewangan')}</option>
                                    <option value="hr">{tr('HR', 'Sumber Manusia')}</option>
                                    <option value="legal">{tr('Legal', 'Perundangan')}</option>
                                    <option value="logistics">{tr('Logistics', 'Logistik')}</option>
                                    <option value="it">{tr('IT / Engineering', 'IT / Kejuruteraan')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-secondary pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Asset Type Filter */}
                        <div className="flex flex-col gap-space-xs min-w-[170px]">
                            <label className="font-label-sm text-label-sm text-secondary" htmlFor="filter-type">
                                {tr('Asset type', 'Jenis aset')}
                            </label>
                            <div className="relative">
                                <select
                                    id="filter-type"
                                    value={assetType}
                                    onChange={(e) => setAssetType(e.target.value)}
                                    className="w-full h-8 pl-space-sm pr-8 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container cursor-pointer transition-colors"
                                >
                                    <option value="all">{tr('All asset types', 'Semua jenis aset')}</option>
                                    <option value="printer">{tr('Printer', 'Pencetak')}</option>
                                    <option value="workstation">{tr('Workstation', 'Stesen kerja')}</option>
                                    <option value="server">{tr('Server', 'Pelayan')}</option>
                                    <option value="network">{tr('Network switch', 'Suis rangkaian')}</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-secondary pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-space-sm self-end pt-space-xs">
                        <button
                            id="reset-filters-btn"
                            type="button"
                            onClick={handleResetFilters}
                            className="h-8 px-space-md rounded bg-transparent hover:bg-surface-container text-secondary font-label-md text-label-md transition-colors"
                        >
                            {tr('Reset', 'Set semula')}
                        </button>
                        <button
                            id="apply-filters-btn"
                            type="button"
                            onClick={handleApplyFilters}
                            className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant hover:border-secondary text-on-surface font-label-md text-label-md transition-colors flex items-center gap-space-xs shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                filter_list
                            </span>
                            {tr('Apply filters', 'Guna penapis')}
                        </button>
                    </div>
                </div>

                {/* Maintenance Schedule Table Container */}
                <div className="rounded bg-surface-container-lowest border border-outline-variant overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table id="maintenance-table" className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant h-9">
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Asset Tag', 'Tag Aset')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Department', 'Jabatan')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Repeat Every', 'Ulang Setiap')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Last Done', 'Terakhir Dilakukan')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Next Due', 'Tarikh Seterusnya')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                                        scope="col"
                                    >
                                        {tr('Status', 'Status')}
                                    </th>
                                    <th
                                        className="px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right"
                                        scope="col"
                                    >
                                        {tr('Action', 'Tindakan')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {schedules.map((row) => {
                                    const isOverdue = row.status === 'Overdue';
                                    const isDueSoon = row.status === 'Due in 3 days';
                                    const isCompleted = completedIds[row.id];

                                    return (
                                        <tr
                                            key={row.id}
                                            className={
                                                isOverdue
                                                    ? 'bg-surface-container-low hover:bg-surface-container transition-colors group'
                                                    : 'bg-surface-container-lowest hover:bg-surface-container-low transition-colors'
                                            }
                                        >
                                            <td className="px-space-md py-space-sm font-mono-data text-mono-data">
                                                <Link
                                                    href={route('assets.show', row.asset_id)}
                                                    className={`${
                                                        isOverdue
                                                            ? 'text-primary-container font-semibold'
                                                            : 'text-primary'
                                                    } hover:underline inline-flex items-center gap-1`}
                                                >
                                                    {row.asset_tag}
                                                    <span className="material-symbols-outlined text-[12px] opacity-70">
                                                        open_in_new
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-space-md py-space-sm font-body-md text-body-md text-on-surface">
                                                {translateDepartment(row.department)}
                                            </td>
                                            <td className="px-space-md py-space-sm font-body-md text-body-md text-secondary">
                                                {row.repeat_label.replace('days', tr('days', 'hari'))}
                                            </td>
                                            <td className="px-space-md py-space-sm font-mono-data text-mono-data text-secondary">
                                                {row.last_done_date}
                                            </td>
                                            <td
                                                className={`px-space-md py-space-sm font-mono-data text-mono-data ${
                                                    isOverdue
                                                        ? 'text-error font-medium'
                                                        : isDueSoon
                                                          ? 'text-on-surface font-medium'
                                                          : 'text-on-surface'
                                                }`}
                                            >
                                                {row.next_due_date}
                                            </td>
                                            <td className="px-space-md py-space-sm">
                                                {isOverdue ? (
                                                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm uppercase tracking-wide bg-primary-fixed border border-primary-container text-primary-container">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                                                        {translateStatus('Overdue')}
                                                    </span>
                                                ) : isDueSoon ? (
                                                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm uppercase tracking-wide bg-surface-container border border-outline-variant text-on-surface-variant">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                                        {translateStatus('Due in 3 days')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm uppercase tracking-wide bg-surface-container-low border border-outline-variant text-secondary">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                                                        {translateStatus(row.status)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-space-md py-space-sm text-right">
                                                <button
                                                    type="button"
                                                    disabled={isCompleted}
                                                    onClick={() => handleMarkDone(row.id)}
                                                    className={`h-7 px-space-md rounded bg-surface-container-lowest border font-label-md text-label-md transition-colors ${
                                                        isOverdue
                                                            ? 'border-primary-container hover:bg-surface-container text-primary-container'
                                                            : 'border-outline-variant hover:border-secondary text-on-surface'
                                                    } ${isCompleted ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    {isCompleted
                                                        ? tr('Completed', 'Selesai')
                                                        : tr('Mark done', 'Tandakan selesai')}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer Meta */}
                    <div className="px-space-md py-space-sm bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-secondary font-mono-data text-label-sm">
                        <span>
                            {tr('Showing', 'Memaparkan')} {schedules.length} {tr('of 36 records', 'daripada 36 rekod')}
                        </span>
                        <div className="flex items-center gap-space-sm">
                            <button
                                disabled
                                type="button"
                                className="text-secondary hover:text-on-surface disabled:opacity-40"
                            >
                                {tr('Previous', 'Sebelumnya')}
                            </button>
                            <span className="text-outline">|</span>
                            <button type="button" className="text-primary font-medium hover:underline">
                                {tr('Next', 'Seterusnya')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Operational Footnote & Policy Directive Panel */}
                <div className="rounded bg-surface-container-low border border-outline-variant p-space-md flex items-start gap-space-sm shadow-sm">
                    <span className="material-symbols-outlined text-[18px] text-primary-container shrink-0 mt-0.5">
                        info
                    </span>
                    <div className="flex flex-col gap-space-xs">
                        <p className="font-body-md text-body-md text-on-surface">
                            <span className="font-semibold text-primary-container">
                                {tr('Operational rule:', 'Peraturan operasi:')}
                            </span>{' '}
                            {tr(
                                'Marking done updates last completed to today and recalculates next due date from the repeat interval.',
                                'Menandakan selesai akan mengemas kini tarikh terakhir kepada hari ini dan mengira semula tarikh seterusnya mengikut selang ulangan.'
                            )}
                        </p>
                        <span className="font-label-sm text-label-sm text-secondary">
                            {tr(
                                'All manual overrides are logged under Alex Mercer [Staff] audit register for compliance ISO/IEC 20000.',
                                'Semua perubahan manual direkodkan di bawah daftar audit Alex Mercer [Staf] untuk pematuhan ISO/IEC 20000.'
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Interactive Modal for Add Schedule */}
            {showModal && (
                <div
                    id="add-schedule-modal"
                    className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md"
                >
                    <div className="bg-surface-container-lowest border border-outline-variant rounded max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('New Maintenance Schedule', 'Jadual Penyelenggaraan Baharu')}
                            </h2>
                            <button
                                id="close-modal-btn"
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form id="new-schedule-form" onSubmit={submitNewSchedule} className="flex flex-col gap-space-md">
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Asset Identifier', 'Pengecam Aset')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. AST-1190"
                                    value={data.asset_tag}
                                    onChange={(e) => setData('asset_tag', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-mono-data text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                                />
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Department', 'Jabatan')}
                                </label>
                                <select
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                                >
                                    <option value="Engineering">{tr('Engineering', 'Kejuruteraan')}</option>
                                    <option value="Finance">{tr('Finance', 'Kewangan')}</option>
                                    <option value="HR">{tr('HR', 'Sumber Manusia')}</option>
                                    <option value="Logistics">{tr('Logistics', 'Logistik')}</option>
                                    <option value="Legal">{tr('Legal', 'Perundangan')}</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Cycle Frequency (Days)', 'Kekerapan Kitaran (Hari)')}
                                </label>
                                <input
                                    type="number"
                                    min="7"
                                    max="365"
                                    required
                                    value={data.repeat_interval_days}
                                    onChange={(e) =>
                                        setData('repeat_interval_days', parseInt(e.target.value || '90', 10))
                                    }
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-mono-data text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    id="cancel-modal-btn"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary hover:bg-surface-container font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-8 px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md"
                                >
                                    {tr('Create Entry', 'Cipta Rekod')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
