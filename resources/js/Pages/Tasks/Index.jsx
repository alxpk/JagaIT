import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TasksIndex({ tasks = [], assets = [], filters = {}, metrics = {} }) {
    const { tr, translateStatus, translateDepartment } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [category, setCategory] = useState(filters.category || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        requester_name: 'Eleanor Vance',
        department: 'Finance',
        category: 'Printer',
        asset_id: assets[0]?.id || '',
        problem_description: '',
        action_taken: '',
        time_spent_minutes: 30,
    });

    const applyFilters = () => {
        router.get(
            route('tasks.index'),
            {
                search: search || undefined,
                status: status || undefined,
                department: department || undefined,
                category: category || undefined,
                date_from: dateFrom || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setDepartment('');
        setCategory('');
        setDateFrom('');
        router.get(route('tasks.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handleExport = () => {
        const rows = [
            ['ID', 'Date', 'Description', 'Department', 'Asset Tag', 'Technician', 'Status'],
            ...tasks.map((t) => [
                t.task_code,
                t.date,
                `"${(t.description || '').replace(/"/g, '""')}"`,
                t.department,
                t.asset_tag,
                t.technician_name,
                t.status,
            ]),
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'tasks-export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const submitNewTask = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => {
                setShowNewTaskModal(false);
                reset('problem_description', 'action_taken');
            },
        });
    };

    const renderStatusBadge = (taskStatus) => {
        switch (taskStatus) {
            case 'In progress':
                return (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm tracking-wide bg-secondary-container text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        {translateStatus('In progress')}
                    </span>
                );
            case 'Escalated to HQ':
                return (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm tracking-wide bg-primary text-on-primary font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-primary"></span>
                        {translateStatus('Escalated to HQ')}
                    </span>
                );
            case 'Resolved':
                return (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm tracking-wide bg-surface-container-high text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {translateStatus('Resolved')}
                    </span>
                );
            case 'Verified':
                return (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm tracking-wide bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed"></span>
                        {translateStatus('Verified')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm tracking-wide bg-surface-container text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        {translateStatus(taskStatus || 'Open')}
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={tr('Incident List - IT Support Tracker', 'Senarai Insiden - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full gap-space-lg">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm">
                    <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[22px]">checklist</span>
                        </div>
                        <div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                                {tr('Incident List', 'Senarai Insiden')}
                            </h1>
                            <p className="font-body-sm text-body-sm text-secondary">
                                {tr(
                                    'Operational service requests, infrastructure tickets, and hardware escalations',
                                    'Permohonan perkhidmatan operasi, tiket infrastruktur, dan eskalasi perkakasan'
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={handleExport}
                            className="h-8 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md flex items-center gap-space-xs transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">file_download</span>
                            <span>{tr('Export', 'Eksport')}</span>
                        </button>
                        <Link
                            href={route('tasks.create')}
                            className="h-8 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md flex items-center gap-space-xs shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>{tr('Register Incident', 'Daftar Insiden')}</span>
                        </Link>
                    </div>
                </div>

                {/* Operational Metric Strips */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                                {tr('Awaiting Intake', 'Menunggu Penerimaan')}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface mt-space-xs">
                                {metrics?.awaitingIntake ?? 14}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary text-[18px]">
                                pending_actions
                            </span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                                {tr('In Active Triage', 'Dalam Triage Aktif')}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface mt-space-xs">
                                {metrics?.inActiveTriage ?? 28}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[18px]">hourglass_top</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                                {tr('Escalated to HQ', 'Dinaikkan ke HQ')}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-primary mt-space-xs">
                                {metrics?.escalatedToHq ?? '03'}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-primary-fixed-variant text-[18px]">
                                emergency
                            </span>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-lg flex items-center justify-between shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                                {tr('Resolved Today', 'Diselesaikan Hari Ini')}
                            </span>
                            <span className="font-headline-sm text-headline-sm text-on-surface mt-space-xs">
                                {metrics?.resolvedToday ?? 41}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary text-[18px]">task_alt</span>
                        </div>
                    </div>
                </div>

                {/* Filter panel */}
                <div className="bg-surface-container-low p-space-md rounded-lg shadow-sm flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs font-label-md text-label-md text-secondary">
                            <span className="material-symbols-outlined text-[16px]">filter_list</span>
                            <span className="uppercase tracking-wider">
                                {tr('Telemetry & Criteria Filters', 'Penapis Telemetri & Kriteria')}
                            </span>
                        </div>
                        <button
                            id="clearFiltersBtn"
                            type="button"
                            onClick={clearFilters}
                            className="font-body-sm text-body-sm text-secondary hover:text-primary transition-colors flex items-center gap-space-xs"
                        >
                            <span className="material-symbols-outlined text-[14px]">refresh</span>
                            <span>{tr('Clear', 'Kosongkan')}</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm items-end">
                        {/* Search Input */}
                        <div className="flex flex-col gap-space-xs lg:col-span-2">
                            <label className="font-label-md text-label-md text-secondary" htmlFor="filterSearch">
                                {tr('Task Identifier / Subject', 'ID Tugasan / Subjek')}
                            </label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined text-[18px] text-outline absolute left-2 pointer-events-none">
                                    search
                                </span>
                                <input
                                    id="filterSearch"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder={tr(
                                        'Search task ID, requester, asset...',
                                        'Cari ID tugasan, pemohon, aset...'
                                    )}
                                    className="w-full h-8 pl-8 pr-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest"
                                />
                            </div>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary" htmlFor="statusSelect">
                                {tr('Status', 'Status')}
                            </label>
                            <div className="relative">
                                <select
                                    id="statusSelect"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-8 px-space-sm appearance-none bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md focus:outline-none pr-7 cursor-pointer"
                                >
                                    <option value="">{tr('All statuses', 'Semua status')}</option>
                                    <option value="Open">{tr('Open', 'Dibuka')}</option>
                                    <option value="In progress">{tr('In progress', 'Dalam Proses')}</option>
                                    <option value="Escalated to HQ">{tr('Escalated to HQ', 'Dinaikkan ke HQ')}</option>
                                    <option value="Resolved">{tr('Resolved', 'Selesai')}</option>
                                    <option value="Verified">{tr('Verified', 'Disahkan')}</option>
                                </select>
                                <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-2 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Department dropdown */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary" htmlFor="deptSelect">
                                {tr('Department', 'Jabatan')}
                            </label>
                            <div className="relative">
                                <select
                                    id="deptSelect"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full h-8 px-space-sm appearance-none bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md focus:outline-none pr-7 cursor-pointer"
                                >
                                    <option value="">{tr('All departments', 'Semua jabatan')}</option>
                                    <option value="Logistics">{tr('Logistics', 'Logistik')}</option>
                                    <option value="Finance">{tr('Finance', 'Kewangan')}</option>
                                    <option value="Legal">{tr('Legal', 'Perundangan')}</option>
                                    <option value="Engineering">{tr('Engineering', 'Kejuruteraan')}</option>
                                    <option value="HR">{tr('HR', 'Sumber Manusia')}</option>
                                </select>
                                <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-2 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* Category dropdown */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary" htmlFor="categorySelect">
                                {tr('Category', 'Kategori')}
                            </label>
                            <div className="relative">
                                <select
                                    id="categorySelect"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-8 px-space-sm appearance-none bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md focus:outline-none pr-7 cursor-pointer"
                                >
                                    <option value="">{tr('All categories', 'Semua kategori')}</option>
                                    <option value="Hardware">{tr('Hardware', 'Perkakasan')}</option>
                                    <option value="Network">{tr('Network', 'Rangkaian')}</option>
                                    <option value="Printer">{tr('Printer', 'Pencetak')}</option>
                                    <option value="Account">{tr('Account', 'Akaun')}</option>
                                    <option value="Software">{tr('Software', 'Perisian')}</option>
                                </select>
                                <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-2 pointer-events-none">
                                    expand_more
                                </span>
                            </div>
                        </div>

                        {/* From date & Action button */}
                        <div className="flex items-center gap-space-xs">
                            <div className="flex-1 flex flex-col gap-space-xs">
                                <label className="font-label-md text-label-md text-secondary" htmlFor="dateFrom">
                                    {tr('From date', 'Dari tarikh')}
                                </label>
                                <input
                                    id="dateFrom"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full h-8 px-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md focus:outline-none cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <label className="opacity-0 font-label-md text-label-md">Apply</label>
                                <button
                                    id="applyFiltersBtn"
                                    type="button"
                                    onClick={applyFilters}
                                    className="h-8 px-space-md rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-body-md text-body-md flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <span>{tr('Apply', 'Tapis')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-surface-container-low h-9 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">ID</th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Date', 'Tarikh')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Description', 'Keterangan')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Department', 'Jabatan')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Asset Tag', 'Tag Aset')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Technician', 'Juruteknik')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold" scope="col">
                                        {tr('Status', 'Status')}
                                    </th>
                                    <th className="px-space-md py-space-xs font-semibold text-right" scope="col">
                                        {tr('Actions', 'Tindakan')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                id="tasksTableBody"
                                className="divide-y divide-surface-container-low text-on-surface font-body-md text-body-md"
                            >
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className={`h-10 hover:bg-surface-container-low/50 transition-colors ${
                                            task.status === 'Escalated to HQ' ? 'bg-surface-container-low/20' : ''
                                        }`}
                                    >
                                        <td className="px-space-md py-space-xs whitespace-nowrap">
                                            <Link
                                                href={route('tasks.show', task.id)}
                                                className="font-mono-data text-mono-data text-primary hover:underline font-semibold"
                                            >
                                                {task.task_code}
                                            </Link>
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap text-secondary font-mono-data text-mono-data">
                                            {task.date}
                                        </td>
                                        <td
                                            className="px-space-md py-space-xs max-w-xs truncate"
                                            title={task.description}
                                        >
                                            {task.description}
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap">
                                            <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-body-sm text-body-sm">
                                                {translateDepartment(task.department)}
                                            </span>
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap font-mono-data text-mono-data text-secondary">
                                            {task.asset_id ? (
                                                <Link
                                                    href={route('assets.show', task.asset_id)}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {task.asset_tag}
                                                </Link>
                                            ) : (
                                                task.asset_tag
                                            )}
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap">
                                            <div className="flex items-center gap-space-xs">
                                                <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm text-secondary font-bold">
                                                    {task.technician_initial}
                                                </div>
                                                <span>{task.technician_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap">
                                            {renderStatusBadge(task.status)}
                                        </td>
                                        <td className="px-space-md py-space-xs whitespace-nowrap text-right">
                                            <Link
                                                href={route('tasks.show', task.id)}
                                                title={tr('Inspect task', 'Periksa tugasan')}
                                                className="w-7 h-7 rounded hover:bg-surface-container text-secondary inline-flex items-center justify-center transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">
                                                    more_vert
                                                </span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer row */}
                    <div className="px-space-md py-space-sm bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-secondary">
                        <div className="flex items-center gap-space-xs">
                            <span>
                                {tr('Showing', 'Memaparkan')}{' '}
                                <strong className="text-on-surface font-semibold">1</strong> {tr('to', 'hingga')}{' '}
                                <strong className="text-on-surface font-semibold">{tasks.length}</strong>{' '}
                                {tr('of', 'daripada')}{' '}
                                <strong className="text-on-surface font-semibold">142</strong>{' '}
                                {tr('tasks', 'tugasan')}
                            </span>
                        </div>
                        <div className="flex items-center gap-space-md">
                            <span className="font-label-md text-label-md text-secondary">
                                {tr('Page 1 of 12', 'Halaman 1 daripada 12')}
                            </span>
                            <div className="flex items-center gap-space-xs">
                                <button
                                    disabled
                                    type="button"
                                    className="h-8 px-space-sm rounded-lg bg-surface-container text-outline cursor-not-allowed flex items-center gap-space-xs transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                                    <span>{tr('Previous', 'Sebelumnya')}</span>
                                </button>
                                <button
                                    type="button"
                                    className="h-8 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center gap-space-xs transition-colors cursor-pointer"
                                >
                                    <span>{tr('Next', 'Seterusnya')}</span>
                                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Diagnostics Strip */}
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm font-mono-data text-mono-data text-secondary">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span>{tr('SYNC ENGINE: OK', 'ENJIN PENYEGERAKAN: OK')}</span>
                        <span>·</span>
                        <span>{tr('DISPATCH RUNTIME: 24ms', 'MASA HANTARAN: 24ms')}</span>
                        <span>·</span>
                        <span>REGION: HQ-US-EAST</span>
                    </div>
                    <div className="flex items-center gap-space-md font-body-sm text-body-sm text-secondary">
                        <Link href={route('reports.index')} className="hover:text-primary transition-colors">
                            {tr('Audit log', 'Log audit')}
                        </Link>
                        <Link href={route('tasks.index')} className="hover:text-primary transition-colors">
                            {tr('Batch reassign', 'Agihan semula pukal')}
                        </Link>
                        <Link href={route('reports.index')} className="hover:text-primary transition-colors">
                            {tr('Service SLAs', 'SLA Perkhidmatan')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Log New Task Modal */}
            {showNewTaskModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('Log New Support Task', 'Rekod Tugasan Sokongan Baharu')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowNewTaskModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={submitNewTask} className="flex flex-col gap-space-md">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                                <div className="flex flex-col gap-space-xs">
                                    <label className="font-label-sm text-label-sm text-secondary">
                                        {tr('Requester Name', 'Nama Pemohon')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.requester_name}
                                        onChange={(e) => setData('requester_name', e.target.value)}
                                        className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                    />
                                    {errors.requester_name && (
                                        <span className="text-error text-body-sm">{errors.requester_name}</span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-space-xs">
                                    <label className="font-label-sm text-label-sm text-secondary">
                                        {tr('Department', 'Jabatan')}
                                    </label>
                                    <select
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                    >
                                        <option value="Finance">{tr('Finance', 'Kewangan')}</option>
                                        <option value="Logistics">{tr('Logistics', 'Logistik')}</option>
                                        <option value="Legal">{tr('Legal', 'Perundangan')}</option>
                                        <option value="Engineering">{tr('Engineering', 'Kejuruteraan')}</option>
                                        <option value="HR">{tr('HR', 'Sumber Manusia')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                                <div className="flex flex-col gap-space-xs">
                                    <label className="font-label-sm text-label-sm text-secondary">
                                        {tr('Category', 'Kategori')}
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                    >
                                        <option value="Printer">{tr('Printer', 'Pencetak')}</option>
                                        <option value="Network">{tr('Network', 'Rangkaian')}</option>
                                        <option value="Account">{tr('Account', 'Akaun')}</option>
                                        <option value="Hardware">{tr('Hardware', 'Perkakasan')}</option>
                                        <option value="Software">{tr('Software', 'Perisian')}</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-space-xs">
                                    <label className="font-label-sm text-label-sm text-secondary">
                                        {tr('Associated Asset', 'Aset Berkaitan')}
                                    </label>
                                    <select
                                        value={data.asset_id}
                                        onChange={(e) => setData('asset_id', e.target.value)}
                                        className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-mono-data text-body-md text-on-surface"
                                    >
                                        {assets.map((asset) => (
                                            <option key={asset.id} value={asset.id}>
                                                {asset.asset_tag} ({asset.model})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Problem Description', 'Keterangan Masalah')}
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={data.problem_description}
                                    onChange={(e) => setData('problem_description', e.target.value)}
                                    placeholder={tr(
                                        'Describe system symptoms, error codes, and initial diagnostics...',
                                        'Terangkan simptom sistem, kod ralat, dan diagnostik awal...'
                                    )}
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                                {errors.problem_description && (
                                    <span className="text-error text-body-sm">{errors.problem_description}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTaskModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary hover:bg-surface-container font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-8 px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold"
                                >
                                    {tr('Create Task', 'Cipta Tugasan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
