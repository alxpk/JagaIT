import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AssetShow({ asset, maintenance, jobHistory = [] }) {
    const { tr, translateStatus, translateCategory, translateDepartment } = useLanguage();
    const [savedTodayFeedback, setSavedTodayFeedback] = useState(false);
    const [pingStatus, setPingStatus] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogTaskModal, setShowLogTaskModal] = useState(false);

    const editForm = useForm({
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        department: asset.raw_department || 'Finance',
        location: asset.location || '',
        operational_status: asset.operational_status || 'In use',
    });

    const taskForm = useForm({
        requester_name: 'Eleanor Vance',
        department: asset.raw_department || 'Finance',
        category: asset.type === 'Printer' ? 'Printer' : 'Hardware',
        asset_id: asset.id,
        problem_description: '',
        action_taken: '',
        time_spent_minutes: 30,
    });

    const handleMarkMaintenanceDone = () => {
        setSavedTodayFeedback(true);
        router.patch(
            route('assets.update', asset.id),
            { action: 'mark_maintenance_done' },
            {
                preserveScroll: true,
                onFinish: () => {
                    setTimeout(() => setSavedTodayFeedback(false), 3000);
                },
            }
        );
    };

    const handleToggleStatus = () => {
        router.patch(
            route('assets.update', asset.id),
            { action: 'toggle_status' },
            { preserveScroll: true }
        );
    };

    const handleDiagnosticPing = () => {
        setPingStatus('1.4ms OK');
        setTimeout(() => setPingStatus(null), 2500);
    };

    const handleExportAuditCsv = () => {
        const rows = [
            ['Task', 'Date', 'Problem / Event', 'Action Taken', 'Status'],
            ...jobHistory.map((j) => [
                j.task_code,
                `"${j.date}"`,
                `"${(j.problem || '').replace(/"/g, '""')}"`,
                `"${(j.action_taken || '').replace(/"/g, '""')}"`,
                j.status,
            ]),
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `${asset.asset_tag}-audit-history.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const submitEditAsset = (e) => {
        e.preventDefault();
        editForm.patch(route('assets.update', asset.id), {
            preserveScroll: true,
            onSuccess: () => setShowEditModal(false),
        });
    };

    const submitNewTask = (e) => {
        e.preventDefault();
        taskForm.post(route('tasks.store'), {
            onSuccess: () => setShowLogTaskModal(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${tr('Asset', 'Aset')} ${asset.asset_tag} - IT Support Tracker`} />

            <div className="flex flex-col w-full">
                {/* Sub-Header / Utility Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-lg gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                        <Link
                            href={route('assets.index')}
                            className="inline-flex items-center gap-1 font-body-md text-body-md text-primary-container hover:text-primary transition-colors font-medium"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            {tr('Back to assets', 'Kembali ke senarai aset')}
                        </Link>
                        <div className="flex items-center gap-space-md mt-space-xs">
                            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                                {tr('Asset', 'Aset')} {asset.asset_tag}
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm uppercase bg-surface-container text-on-surface-variant font-mono-data">
                                {tr('Asset Class', 'Kelas Aset')}: {translateCategory(asset.asset_class)}
                            </span>
                        </div>
                    </div>

                    {/* Right Utility Actions */}
                    <div className="flex items-center gap-space-sm self-start md:self-auto">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(true)}
                            className="h-8 px-space-md rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors font-body-md text-body-md shadow-sm flex items-center gap-1.5 font-medium"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">edit</span>
                            {tr('Edit asset', 'Sunting aset')}
                        </button>
                        <button
                            id="btn-log-task"
                            type="button"
                            onClick={() => setShowLogTaskModal(true)}
                            className="h-8 px-space-md rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-body-md text-body-md flex items-center gap-1.5 font-medium shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            {tr('Log task for this asset', 'Rekod tugasan untuk aset ini')}
                        </button>
                    </div>
                </div>

                {/* Operational Grid Workspace */}
                <div className="grid grid-cols-12 gap-space-lg">
                    {/* Top Left: Key Technical Details (8 Cols) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-lg">
                        <div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">
                            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">
                                        memory
                                    </span>
                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr('Asset Metadata & Specifications', 'Metadata & Spesifikasi Aset')}
                                    </span>
                                </div>
                                <span className="font-mono-data text-mono-data text-secondary">
                                    UID: {asset.uid_code}
                                </span>
                            </div>

                            <div className="p-space-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-space-lg gap-x-space-xl">
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Type', 'Jenis')}
                                    </span>
                                    <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface font-medium">
                                        <span className="material-symbols-outlined text-[18px] text-primary">
                                            print
                                        </span>
                                        {translateCategory(asset.type)}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Model', 'Model')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface font-medium">
                                        {asset.model}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Serial Number', 'Nombor Siri')}
                                    </span>
                                    <span className="font-mono-data text-mono-data text-on-surface font-semibold bg-surface-container px-2 py-0.5 rounded w-fit select-all">
                                        {asset.serial_number}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Department', 'Jabatan')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface font-medium">
                                        {translateDepartment(asset.department)}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Location', 'Lokasi')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-outline">
                                            location_on
                                        </span>
                                        {asset.location}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                        {tr('Operational Status', 'Status Operasi')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 h-[22px] rounded-full text-label-sm font-label-sm bg-surface-container-low text-secondary font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                            {translateStatus(asset.operational_status)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleToggleStatus}
                                            className="text-outline hover:text-on-surface text-label-sm font-label-sm underline"
                                        >
                                            {tr('Change', 'Tukar')}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:col-span-2 lg:col-span-3 pt-space-xs bg-surface-container-low/50 p-space-md rounded">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                                                {tr('Manufacturer Warranty', 'Waranti Pengeluar')}
                                            </span>
                                            <p className="font-body-md text-body-md text-on-surface font-medium mt-0.5">
                                                {tr('Expires', 'Tamat pada')} {asset.warranty_expires_label}
                                                <span className="text-primary font-semibold ml-1">
                                                    ({asset.warranty_tier})
                                                </span>
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-[20px] text-primary">
                                            verified_user
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Right: Visual Schematic & Telemetry Card (4 Cols) */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-lg">
                        <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-lg flex flex-col justify-between">
                            <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg py-space-md">
                                <span className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Unit Hardware State', 'Keadaan Perkakasan Unit')}
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono-data text-label-sm text-primary">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>{' '}
                                    {asset.hardware_state}
                                </span>
                            </div>

                            <div className="flex items-center gap-space-md my-space-xs">
                                <div className="relative w-24 h-24 rounded bg-surface-container-low flex items-center justify-center shrink-0">
                                    <img
                                        src={asset.image_url}
                                        alt={asset.model}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <span className="font-mono-data text-mono-data text-secondary truncate">
                                        IP: {asset.ip_address}
                                    </span>
                                    <span className="font-mono-data text-mono-data text-secondary truncate">
                                        MAC: {asset.mac_address}
                                    </span>
                                    <div className="w-full bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary-container h-full rounded-full"
                                            style={{ width: `${asset.toner_level}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-label-sm font-label-sm text-outline mt-0.5">
                                        {tr('Black Toner Level', 'Tahap Toner Hitam')}: {asset.toner_level}%
                                    </span>
                                </div>
                            </div>

                            <div className="mt-space-md pt-space-md flex items-center justify-between bg-surface-container-low p-space-sm rounded">
                                <div className="flex flex-col">
                                    <span className="text-label-sm font-label-sm text-secondary">
                                        {tr('Total Page Count', 'Jumlah Kiraan Halaman')}
                                    </span>
                                    <span className="font-mono-data text-body-md font-semibold text-on-surface">
                                        {asset.total_page_count.replace('pages', tr('pages', 'halaman'))}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDiagnosticPing}
                                    className="h-7 px-2.5 rounded bg-surface-container-lowest text-primary text-label-sm font-label-sm font-medium hover:bg-surface-container"
                                >
                                    {pingStatus || tr('Diagnostic Ping', 'Ping Diagnostik')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Schedule Panel (Full Width within layout) */}
                    <div className="col-span-12">
                        <div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">
                            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">
                                        update
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr('Maintenance Schedule', 'Jadual Penyelenggaraan')}
                                    </h2>
                                </div>
                                <span className="font-label-sm text-label-sm text-secondary uppercase font-mono-data tracking-wide">
                                    {tr('Cadence: Scheduled Periodic', 'Kekerapan: Berkala Dijadualkan')}
                                </span>
                            </div>

                            <div className="p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg flex-1">
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                            {tr('Repeat every', 'Ulang setiap')}
                                        </span>
                                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                                            {maintenance.repeat_every.replace('days', tr('days', 'hari'))}
                                        </span>
                                        <span className="text-label-sm font-label-sm text-outline mt-0.5">
                                            {tr('Preventative Maintenance Cycle', 'Kitaran Penyelenggaraan Pencegahan')}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-space-xs">
                                            {tr('Last done', 'Terakhir dilakukan')}
                                        </span>
                                        <span className="font-body-md text-body-md font-medium text-on-surface">
                                            {maintenance.last_done}
                                        </span>
                                        <span className="text-label-sm font-label-sm text-secondary mt-0.5">
                                            {maintenance.technician_note}
                                        </span>
                                    </div>

                                    {/* Overdue Highlight Box */}
                                    <div className="flex flex-col bg-surface-container p-space-sm rounded">
                                        <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold mb-space-xs flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">warning</span>
                                            {tr('Next due', 'Tarikh seterusnya')}
                                        </span>
                                        <div className="flex items-center gap-space-xs flex-wrap">
                                            <span className="font-body-md text-body-md font-bold text-on-surface">
                                                {maintenance.next_due}
                                            </span>
                                            <span className="text-label-sm font-label-sm font-bold text-primary px-1.5 py-0.5 rounded bg-surface-container-lowest">
                                                {maintenance.overdue_badge === 'Overdue by 3 days'
                                                    ? tr('Overdue by 3 days', 'Tertunggak 3 hari')
                                                    : translateStatus(maintenance.overdue_badge)}
                                            </span>
                                        </div>
                                        <span className="text-label-sm font-label-sm text-primary mt-1">
                                            {maintenance.maintenance_note}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end shrink-0 pt-space-sm md:pt-0">
                                    <button
                                        id="btn-mark-done"
                                        type="button"
                                        onClick={handleMarkMaintenanceDone}
                                        className={`h-8 px-space-md rounded transition-colors font-body-md text-body-md font-semibold flex items-center gap-1.5 shadow-sm ${
                                            savedTodayFeedback
                                                ? 'bg-primary-container text-on-primary'
                                                : 'bg-surface-container text-primary hover:bg-surface-container-high'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {savedTodayFeedback ? 'done' : 'check_circle'}
                                        </span>
                                        {savedTodayFeedback
                                            ? tr('Saved Today', 'Disimpan Hari Ini')
                                            : tr('Mark maintenance done', 'Tandakan penyelenggaraan selesai')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job History Table Panel (12 Cols) */}
                    <div className="col-span-12">
                        <div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">
                            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[18px] text-secondary">
                                        history
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr('Job History Log', 'Log Sejarah Kerja')}
                                    </h2>
                                </div>
                                <span className="font-label-sm text-label-sm text-secondary font-mono-data">
                                    {jobHistory.length} {tr('Entries Logged', 'Rekod Dicatatkan')}
                                </span>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low h-9">
                                            <th className="px-space-lg py-2 font-label-sm text-label-sm text-secondary uppercase font-semibold w-24">
                                                {tr('Task', 'Tugasan')}
                                            </th>
                                            <th className="px-space-md py-2 font-label-sm text-label-sm text-secondary uppercase font-semibold w-32">
                                                {tr('Date', 'Tarikh')}
                                            </th>
                                            <th className="px-space-md py-2 font-label-sm text-label-sm text-secondary uppercase font-semibold">
                                                {tr('Problem / Event', 'Masalah / Peristiwa')}
                                            </th>
                                            <th className="px-space-md py-2 font-label-sm text-label-sm text-secondary uppercase font-semibold">
                                                {tr('Action Taken', 'Tindakan Diambil')}
                                            </th>
                                            <th className="px-space-lg py-2 font-label-sm text-label-sm text-secondary uppercase font-semibold text-right w-40">
                                                {tr('Status', 'Status')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-container">
                                        {jobHistory.map((job) => (
                                            <tr
                                                key={job.id}
                                                className="hover:bg-surface-container-low transition-colors h-11 bg-surface-container-lowest"
                                            >
                                                <td className="px-space-lg py-2.5 font-mono-data text-mono-data font-semibold">
                                                    <Link
                                                        href={route('tasks.show', job.id)}
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {job.task_code}
                                                        <span className="material-symbols-outlined text-[12px]">
                                                            open_in_new
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td className="px-space-md py-2.5 font-body-sm text-body-sm text-secondary font-mono-data">
                                                    {job.date}
                                                </td>
                                                <td className="px-space-md py-2.5 font-body-md text-body-md text-on-surface font-medium">
                                                    {job.problem}
                                                </td>
                                                <td className="px-space-md py-2.5 font-body-md text-body-md text-on-surface-variant">
                                                    {job.action_taken}
                                                </td>
                                                <td className="px-space-lg py-2.5 text-right">
                                                    {job.status === 'Escalated to HQ' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 h-[22px] rounded-full text-label-sm font-label-sm bg-primary-container text-on-primary font-semibold shadow-xs">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-on-primary"></span>
                                                            {translateStatus('Escalated to HQ')}
                                                        </span>
                                                    ) : job.status === 'Verified' ? (
                                                        <span className="inline-flex items-center px-2.5 h-[22px] rounded-full text-label-sm font-label-sm bg-surface-container-low text-secondary font-medium">
                                                            {translateStatus('Verified')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 h-[22px] rounded-full text-label-sm font-label-sm bg-surface-container text-secondary font-medium">
                                                            {translateStatus(job.status)}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer / Telemetry Bar */}
                            <div className="px-space-lg py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm text-secondary text-label-sm font-label-sm">
                                <span>
                                    {tr('Showing', 'Memaparkan')} {jobHistory.length}{' '}
                                    {tr(
                                        `historical records associated with ${asset.asset_tag}`,
                                        `rekod sejarah berkaitan dengan ${asset.asset_tag}`
                                    )}
                                </span>
                                <div className="flex items-center gap-space-sm">
                                    <button
                                        type="button"
                                        onClick={handleExportAuditCsv}
                                        className="hover:text-on-surface transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">download</span>{' '}
                                        {tr('Export Audit CSV', 'Eksport CSV Audit')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Asset Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('Edit Asset', 'Sunting Aset')} {asset.asset_tag}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={submitEditAsset} className="flex flex-col gap-space-md">
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Model', 'Model')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.model}
                                    onChange={(e) => editForm.setData('model', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Serial Number', 'Nombor Siri')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.serial_number}
                                    onChange={(e) => editForm.setData('serial_number', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-mono-data text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Department', 'Jabatan')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.department}
                                    onChange={(e) => editForm.setData('department', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Location', 'Lokasi')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.location}
                                    onChange={(e) => editForm.setData('location', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="h-8 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
                                >
                                    {tr('Save Changes', 'Simpan Perubahan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Log Task for Asset Modal */}
            {showLogTaskModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('Log Task for', 'Rekod Tugasan untuk')} {asset.asset_tag}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowLogTaskModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={submitNewTask} className="flex flex-col gap-space-md">
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Requester Name', 'Nama Pemohon')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={taskForm.data.requester_name}
                                    onChange={(e) => taskForm.setData('requester_name', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Problem Description', 'Keterangan Masalah')}
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={taskForm.data.problem_description}
                                    onChange={(e) => taskForm.setData('problem_description', e.target.value)}
                                    placeholder={tr(
                                        'Describe the incident or hardware symptom...',
                                        'Terangkan insiden atau simptom perkakasan...'
                                    )}
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setShowLogTaskModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={taskForm.processing}
                                    className="h-8 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
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
