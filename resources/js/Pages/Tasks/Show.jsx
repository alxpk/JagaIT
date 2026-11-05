import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TaskShow({ task }) {
    const { tr, translateStatus, translateCategory, translateDepartment } = useLanguage();
    const [showHqModal, setShowHqModal] = useState(false);
    const [hqResponseInput, setHqResponseInput] = useState(task.hq_response || '');

    const { data, setData, patch, processing } = useForm({
        problem_description: task.problem_description || '',
        action_taken: task.action_taken || '',
        time_spent_minutes: task.time_spent_minutes ?? 45,
    });

    const handleSaveTask = () => {
        patch(route('tasks.update', task.id), { preserveScroll: true });
    };

    const handleQuickAction = (action) => {
        router.patch(
            route('tasks.update', task.id),
            { action },
            { preserveScroll: true }
        );
    };

    const handleRecordHqResponse = (e) => {
        e.preventDefault();
        router.patch(
            route('tasks.update', task.id),
            { action: 'record_hq_response', hq_response: hqResponseInput },
            {
                preserveScroll: true,
                onSuccess: () => setShowHqModal(false),
            }
        );
    };

    const handleRemoveAttachment = (attachmentId) => {
        router.patch(
            route('tasks.update', task.id),
            { action: 'remove_attachment', attachment_id: attachmentId },
            { preserveScroll: true }
        );
    };

    const handleSimulatedUpload = () => {
        const fileName = `diagnostic_capture_${Math.floor(100 + Math.random() * 900)}.png`;
        router.patch(
            route('tasks.update', task.id),
            { action: 'add_attachment', name: fileName, size: '2.1 MB' },
            { preserveScroll: true }
        );
    };

    const handleCreateKbFromTask = () => {
        router.post(route('knowledge-base.store'), {
            title: `Resolution Protocol for ${task.task_code} (${task.category})`,
            category: task.category || 'Printer',
            summary: task.hq_response || task.action_taken || task.problem_description,
            problem_description: task.problem_description,
            source_task_id: task.id,
            steps: [
                'Isolate hardware endpoint and verify error telemetry logs.',
                task.action_taken || 'Perform local tier-1 and tier-2 hardware diagnostic checks.',
                task.hq_response || 'Apply HQ warranty dispatch replacement protocol and verify operation.',
            ],
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${tr('Task', 'Tugasan')} ${task.task_code} - IT Support Tracker`} />

            <div className="flex flex-col w-full">
                {/* Breadcrumbs & Status Bar */}
                <div className="flex items-center justify-between pb-space-md">
                    <div className="flex items-center gap-space-sm">
                        <Link
                            href={route('tasks.index')}
                            className="flex items-center gap-space-xs font-body-md text-body-md text-primary-container hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            {tr('Back to tasks', 'Kembali ke senarai tugasan')}
                        </Link>
                        <span className="text-outline-variant font-mono-data text-mono-data">/</span>
                        <span className="font-mono-data text-mono-data text-secondary">
                            TASK-REF: {task.reference_code}
                        </span>
                    </div>
                    <div className="flex items-center gap-space-xs text-secondary font-mono-data text-mono-data">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary-container"></span>
                        {tr('HQ BRIDGE SYNC: ACTIVE', 'JAMBATAN PENYEGERAKAN HQ: AKTIF')}
                    </div>
                </div>

                {/* Primary Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-lg">
                    <div className="flex items-center gap-space-md">
                        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                            {tr('Task', 'Tugasan')} {task.task_code}
                        </h1>
                        <span className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider bg-surface-container text-primary-container">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                            {translateStatus(task.status)}
                        </span>
                        <span className="font-mono-data text-mono-data px-2 py-0.5 rounded bg-surface-container text-secondary">
                            SL-A: {task.sla_tier}
                        </span>
                    </div>
                    <div className="flex items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="h-8 px-space-md rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md flex items-center gap-space-xs"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">print</span>
                            {tr('Export Schematic', 'Eksport Skematik')}
                        </button>
                        <button
                            type="button"
                            className="h-8 px-space-md rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-body-md text-body-md flex items-center gap-space-xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">history</span>
                            {tr('Live Audit Stream', 'Strim Audit Langsung')}
                        </button>
                    </div>
                </div>

                {/* Main Structural Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                    {/* Left Column: Core Technical Record & Evidence (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-space-lg">
                        {/* Task Details Panel */}
                        <section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
                            {/* Panel Header */}
                            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[18px] text-primary-container">
                                        receipt_long
                                    </span>
                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr('Incident Specifications', 'Spesifikasi Insiden')}
                                    </span>
                                </div>
                                <span className="font-mono-data text-mono-data text-secondary">
                                    {tr('METADATA CLASSIFICATION', 'KLASIFIKASI METADATA')}:{' '}
                                    {task.metadata_classification}
                                </span>
                            </div>

                            {/* Metadata Properties Grid */}
                            <div className="p-space-lg grid grid-cols-2 md:grid-cols-3 gap-space-md bg-surface-container-lowest">
                                <div className="flex flex-col gap-0.5 p-space-sm rounded bg-surface-container-low">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                        {tr('Incident Date', 'Tarikh Insiden')}
                                    </span>
                                    <span className="font-mono-data text-mono-data text-on-surface font-semibold">
                                        {task.incident_at}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 p-space-sm rounded bg-surface-container-low">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                        {tr('Requester Name', 'Nama Pemohon')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface font-medium">
                                        {task.requester_name}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 p-space-sm rounded bg-surface-container-low">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                        {tr('Department', 'Jabatan')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface">
                                        {translateDepartment(
                                            task.department === 'Finance' ? 'Finance Operations' : task.department
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 p-space-sm rounded bg-surface-container-low">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                        {tr('Category', 'Kategori')}
                                    </span>
                                    <span className="font-body-md text-body-md text-on-surface flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-secondary">
                                            print
                                        </span>
                                        {tr('Hardware', 'Perkakasan')} / {translateCategory(task.category)}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5 p-space-sm rounded bg-surface-container-low md:col-span-2">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                        {tr('Associated Asset', 'Aset Berkaitan')}
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono-data text-mono-data text-on-surface font-medium">
                                            {task.asset
                                                ? `${task.asset.asset_tag} (${task.asset.model})`
                                                : 'AST-0842 (HP LaserJet Enterprise M608)'}
                                        </span>
                                        {task.asset && (
                                            <Link
                                                href={route('assets.show', task.asset.id)}
                                                className="font-label-sm text-label-sm text-primary-container hover:underline cursor-pointer"
                                            >
                                                {tr('Specs →', 'Spesifikasi →')}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Problem Description Area */}
                            <div className="px-space-lg pb-space-md flex flex-col gap-space-xs">
                                <label
                                    htmlFor="problem_description"
                                    className="font-label-md text-label-md text-secondary"
                                >
                                    {tr(
                                        'Problem Description (System Payload Diagnostics)',
                                        'Keterangan Masalah (Diagnostik Beban Sistem)'
                                    )}
                                </label>
                                <textarea
                                    id="problem_description"
                                    rows={2}
                                    value={data.problem_description}
                                    onChange={(e) => setData('problem_description', e.target.value)}
                                    className="p-space-md bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface leading-relaxed border-0 focus:ring-1 focus:ring-primary"
                                />
                                {/* Regulatory Note Banner */}
                                <div className="mt-space-xs flex items-center gap-space-sm p-space-sm rounded bg-surface-container-high text-on-surface">
                                    <span className="material-symbols-outlined text-secondary text-[18px]">
                                        warning
                                    </span>
                                    <span className="font-body-sm text-body-sm font-medium">
                                        {tr(
                                            'Note: Do not enter citizen or immigration data. Comply with ISO/IEC 27001 operational sanitization protocols.',
                                            'Nota: Jangan masukkan data warganegara atau imigresen. Patuhi protokol sanitasi operasi ISO/IEC 27001.'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Action Taken & Field Metrics */}
                            <div className="p-space-lg grid grid-cols-1 md:grid-cols-4 gap-space-md">
                                <div className="md:col-span-3 flex flex-col gap-space-xs">
                                    <label
                                        htmlFor="action_taken"
                                        className="font-label-md text-label-md text-secondary"
                                    >
                                        {tr(
                                            'Action Taken (Local Tier-1 / Tier-2 Field Log)',
                                            'Tindakan Diambil (Log Lapangan Lokal Tahap-1 / Tahap-2)'
                                        )}
                                    </label>
                                    <textarea
                                        id="action_taken"
                                        rows={2}
                                        value={data.action_taken}
                                        onChange={(e) => setData('action_taken', e.target.value)}
                                        className="p-space-sm rounded bg-surface-container-low min-h-[58px] font-body-md text-body-md text-on-surface border-0 focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-space-xs">
                                    <label
                                        htmlFor="time_spent_minutes"
                                        className="font-label-md text-label-md text-secondary"
                                    >
                                        {tr('Time Spent', 'Masa Diambil')}
                                    </label>
                                    <div className="h-8 px-space-sm rounded bg-surface-container-low flex items-center justify-between">
                                        <input
                                            id="time_spent_minutes"
                                            type="number"
                                            min="0"
                                            max="1440"
                                            value={data.time_spent_minutes}
                                            onChange={(e) =>
                                                setData('time_spent_minutes', parseInt(e.target.value || '0', 10))
                                            }
                                            className="w-16 bg-transparent border-0 p-0 font-mono-data text-mono-data text-on-surface font-semibold focus:ring-0"
                                        />
                                        <span className="font-label-sm text-label-sm text-secondary uppercase">
                                            {tr('Minutes', 'Minit')}
                                        </span>
                                    </div>
                                    <span className="font-body-sm text-body-sm text-secondary">
                                        {tr('Standard billable', 'Kadar bil piawai')}:{' '}
                                        {((data.time_spent_minutes || 0) / 60).toFixed(2)}h
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Hardware Telemetry & Visual Evidence */}
                        <section className="bg-surface-container-lowest rounded-lg shadow-sm p-space-lg flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-sm">
                                    <span className="material-symbols-outlined text-[18px] text-primary-container">
                                        perm_media
                                    </span>
                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr(
                                            'Evidence & Hardware Telemetry (Photos / Logs)',
                                            'Bukti & Telemetri Perkakasan (Foto / Log)'
                                        )}
                                    </span>
                                </div>
                                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary">
                                    {task.attachments?.length || 0}{' '}
                                    {tr('ATTACHMENTS VERIFIED', 'LAMPIRAN DISAHKAN')}
                                </span>
                            </div>

                            {/* Dropzone Container */}
                            <div
                                onClick={handleSimulatedUpload}
                                className="bg-surface-container-low rounded-lg p-space-lg flex flex-col items-center justify-center text-center gap-space-xs cursor-pointer hover:bg-surface-container transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
                                    <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
                                </div>
                                <p className="font-body-md text-body-md font-medium text-on-surface">
                                    {tr(
                                        'Drag & drop photos or screenshots here, or click to browse',
                                        'Seret & lepas foto atau tangkapan skrin di sini, atau klik untuk pilih'
                                    )}
                                </p>
                                <p className="font-body-sm text-body-sm text-secondary">
                                    {tr(
                                        'Accepted formats: PNG, JPG, PDF up to 10MB each. Automatic hash validation enabled.',
                                        'Format diterima: PNG, JPG, PDF sehingga 10MB setiap satu. Pengesahan hash automatik diaktifkan.'
                                    )}
                                </p>
                                <div className="mt-space-xs">
                                    <button
                                        type="button"
                                        className="h-8 px-space-md rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md"
                                    >
                                        {tr('Choose file', 'Pilih fail')}
                                    </button>
                                </div>
                            </div>

                            {/* File Gallery Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                                {(task.attachments || []).map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-space-md p-space-sm rounded bg-surface-container-low hover:bg-surface-container transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <span className="font-mono-data text-mono-data font-medium text-on-surface truncate">
                                                {file.name}
                                            </span>
                                            <div className="flex items-center gap-space-xs">
                                                <span className="font-body-sm text-body-sm text-secondary">
                                                    {file.size}
                                                </span>
                                                <span className="text-secondary font-mono-data text-mono-data">
                                                    ·
                                                </span>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-body-sm text-body-sm text-primary-container hover:underline"
                                                >
                                                    {tr('Preview', 'Pratonton')}
                                                </a>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(file.id)}
                                            title={tr('Remove attachment', 'Buang lampiran')}
                                            className="h-7 px-space-sm rounded bg-surface-container hover:bg-error-container hover:text-error text-secondary font-body-sm text-body-sm transition-colors"
                                        >
                                            {tr('Remove', 'Buang')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Escalation Payload, Bridge State & Audit Trail (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-space-lg">
                        {/* Prominent HQ Escalation Panel */}
                        <section className="bg-surface-container rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-space-xs">
                                    <span className="material-symbols-outlined text-primary-container text-[20px]">
                                        bolt
                                    </span>
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-semibold">
                                        {tr('Escalation to HQ', 'Eskalasi ke HQ')}
                                    </span>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                    {tr('Dispatched Timestamp', 'Cap Masa Dihantar')}
                                </span>
                                <div className="font-mono-data text-mono-data text-on-surface bg-surface-container-lowest p-space-xs rounded">
                                    {task.escalated_at}{' '}
                                    <span className="text-secondary">
                                        {tr('(Set automatically on escalation)', '(Ditetapkan automatik semasa eskalasi)')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                                    {tr('Payload & Transport Protocol', 'Beban & Protokol Penghantaran')}
                                </span>
                                <p className="font-body-sm text-body-sm text-on-surface bg-surface-container-lowest p-space-sm rounded leading-relaxed">
                                    {tr(
                                        'Summary payload and hardware telemetry sent via',
                                        'Ringkasan beban dan telemetri perkakasan dihantar melalui'
                                    )}{' '}
                                    <span className="font-medium text-primary-container">
                                        HQ Secure Support Bridge API
                                    </span>{' '}
                                    (Ticket #{task.hq_ticket_ref}).
                                </p>
                            </div>

                            <div className="flex flex-col gap-space-xs">
                                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-semibold">
                                    {tr('HQ Operational Response', 'Maklum Balas Operasi HQ')}
                                </span>
                                <div className="bg-surface-container-lowest p-space-sm rounded">
                                    <p className="font-body-md text-body-md text-on-surface leading-normal">
                                        {task.hq_response}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons inside HQ Panel */}
                            <div className="flex flex-col gap-space-xs pt-space-xs">
                                <button
                                    type="button"
                                    onClick={() => setShowHqModal(true)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest text-primary-container hover:bg-surface-container-high transition-colors font-body-md text-body-md font-semibold flex items-center justify-center gap-space-xs"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                                    {tr('Record HQ response', 'Rekod maklum balas HQ')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateKbFromTask}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest text-primary-container hover:bg-surface-container-high transition-colors font-body-md text-body-md font-semibold flex items-center justify-center gap-space-xs"
                                >
                                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                                    {tr(
                                        'Create knowledge base article from this',
                                        'Cipta artikel pangkalan ilmu daripada ini'
                                    )}
                                </button>
                            </div>
                        </section>

                        {/* History & Audit Trail Panel */}
                        <section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
                            <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
                                <span className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Audit History Trail', 'Jejak Sejarah Audit')}
                                </span>
                                <span className="material-symbols-outlined text-[16px] text-secondary">
                                    security_update_good
                                </span>
                            </div>
                            <div className="p-space-lg">
                                <div className="relative flex flex-col gap-space-md">
                                    {(task.audit_trail || []).map((item, idx) => (
                                        <div key={idx} className="flex gap-space-md items-start">
                                            <div
                                                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                                    item.highlight
                                                        ? 'bg-primary-container text-on-primary'
                                                        : 'bg-surface-container text-primary-container'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[14px]">
                                                    {item.icon || 'edit_document'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span
                                                    className={`font-mono-data text-mono-data ${
                                                        item.highlight
                                                            ? 'text-primary-container font-semibold'
                                                            : 'text-secondary'
                                                    }`}
                                                >
                                                    {item.timestamp}
                                                </span>
                                                <span className="font-body-md text-body-md text-on-surface font-medium">
                                                    {item.title}
                                                </span>
                                                <span className="font-body-sm text-body-sm text-secondary">
                                                    {item.subtitle}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Operational Command Bar (Sticky Action Footer) */}
                <div className="mt-space-xl p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-sm">
                        <span className="font-mono-data text-mono-data text-secondary">
                            {tr('STATE', 'KEADAAN')}: {task.state_label}
                        </span>
                        <span className="text-outline-variant">|</span>
                        <span className="font-body-sm text-body-sm text-secondary">
                            {tr(
                                'All actions cryptographically logged',
                                'Semua tindakan direkodkan secara kriptografi'
                            )}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={() => handleQuickAction('verify')}
                            className="h-8 px-space-md rounded bg-surface-container text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md flex items-center gap-space-xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            {tr('Verify task (administrator only)', 'Sahkan tugasan (pentadbir sahaja)')}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickAction('resolve')}
                            className="h-8 px-space-md rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md"
                        >
                            {tr('Mark as resolved', 'Tandakan selesai')}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickAction('escalate')}
                            className="h-8 px-space-md rounded bg-surface-container text-primary-container hover:bg-surface-container-high transition-colors font-body-md text-body-md font-semibold"
                        >
                            {tr('Escalate to HQ', 'Naikkan ke HQ')}
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleSaveTask}
                            className="h-8 px-space-lg rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-body-md text-body-md font-semibold flex items-center gap-space-xs shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            {tr('Save task', 'Simpan tugasan')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Record HQ Response Modal */}
            {showHqModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-md w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('Record HQ Operational Response', 'Rekod Maklum Balas Operasi HQ')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowHqModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleRecordHqResponse} className="flex flex-col gap-space-md">
                            <textarea
                                rows={4}
                                required
                                value={hqResponseInput}
                                onChange={(e) => setHqResponseInput(e.target.value)}
                                className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                            />
                            <div className="flex items-center justify-end gap-space-sm">
                                <button
                                    type="button"
                                    onClick={() => setShowHqModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    className="h-8 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
                                >
                                    {tr('Save Response', 'Simpan Maklum Balas')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
