import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateIncident({ assets = [] }) {
    const { tr } = useLanguage();

    const { data, setData, post, processing, errors, reset } = useForm({
        requester_name: '',
        department: 'Finance',
        category: 'Printer',
        asset_id: assets[0]?.id || '',
        problem_description: '',
        action_taken: '',
        time_spent_minutes: 30,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset('problem_description', 'action_taken'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={tr('Register Incident - IT Support Tracker', 'Daftar Insiden - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full max-w-4xl mx-auto gap-space-lg">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/40">
                    <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[22px]">add_task</span>
                        </div>
                        <div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                                {tr('Register Incident', 'Daftar Insiden')}
                            </h1>
                            <p className="font-body-sm text-body-sm text-secondary">
                                {tr(
                                    'Log a new IT support incident, hardware fault, or service request',
                                    'Rekodkan insiden sokongan IT baharu, kerosakan perkakasan, atau permohonan perkhidmatan'
                                )}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('tasks.index')}
                        className="h-8 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md inline-flex items-center gap-space-xs transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px]">list_alt</span>
                        <span>{tr('View Incident List', 'Lihat Senarai Insiden')}</span>
                    </Link>
                </div>

                {/* Registration Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-surface-container-lowest p-space-xl rounded-lg shadow-sm border border-outline-variant/40 flex flex-col gap-space-lg"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        {/* Requester Name */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="requester_name">
                                {tr('Requester Name', 'Nama Pemohon')} *
                            </label>
                            <input
                                id="requester_name"
                                type="text"
                                required
                                value={data.requester_name}
                                onChange={(e) => setData('requester_name', e.target.value)}
                                placeholder={tr('e.g. Ahmad Razak / Eleanor Vance', 'cth. Ahmad Razak / Eleanor Vance')}
                                className="h-9 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                            />
                            {errors.requester_name && (
                                <span className="text-error text-body-sm">{errors.requester_name}</span>
                            )}
                        </div>

                        {/* Department */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="department">
                                {tr('Department', 'Jabatan')} *
                            </label>
                            <select
                                id="department"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                                className="h-9 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                            >
                                <option value="Finance">{tr('Finance', 'Kewangan')}</option>
                                <option value="Logistics">{tr('Logistics', 'Logistik')}</option>
                                <option value="Legal">{tr('Legal', 'Perundangan')}</option>
                                <option value="Engineering">{tr('Engineering', 'Kejuruteraan')}</option>
                                <option value="HR">{tr('HR', 'Sumber Manusia')}</option>
                            </select>
                            {errors.department && (
                                <span className="text-error text-body-sm">{errors.department}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                        {/* Category */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="category">
                                {tr('Incident Category', 'Kategori Insiden')} *
                            </label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="h-9 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                            >
                                <option value="Printer">{tr('Printer', 'Pencetak')}</option>
                                <option value="Network">{tr('Network', 'Rangkaian')}</option>
                                <option value="Account">{tr('Account', 'Akaun')}</option>
                                <option value="Hardware">{tr('Hardware', 'Perkakasan')}</option>
                                <option value="Software">{tr('Software', 'Perisian')}</option>
                            </select>
                        </div>

                        {/* Associated Asset */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="asset_id">
                                {tr('Associated Asset Tag', 'Tag Aset Berkaitan')}
                            </label>
                            <select
                                id="asset_id"
                                value={data.asset_id}
                                onChange={(e) => setData('asset_id', e.target.value)}
                                className="h-9 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-mono-data text-body-md text-on-surface focus:outline-none focus:border-primary"
                            >
                                <option value="">{tr('None / Unassigned', 'Tiada / Tidak Ditetapkan')}</option>
                                {assets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.asset_tag} ({asset.model})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Time Spent (Minutes) */}
                        <div className="flex flex-col gap-space-xs">
                            <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="time_spent_minutes">
                                {tr('Initial Time Spent (mins)', 'Masa Diambil (minit)')}
                            </label>
                            <input
                                id="time_spent_minutes"
                                type="number"
                                min="0"
                                max="1440"
                                value={data.time_spent_minutes}
                                onChange={(e) => setData('time_spent_minutes', e.target.value)}
                                className="h-9 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-mono-data text-body-md text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Problem Description */}
                    <div className="flex flex-col gap-space-xs">
                        <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="problem_description">
                            {tr('Problem Description', 'Keterangan Masalah')} *
                        </label>
                        <textarea
                            id="problem_description"
                            required
                            rows={4}
                            value={data.problem_description}
                            onChange={(e) => setData('problem_description', e.target.value)}
                            placeholder={tr(
                                'Describe the issue, error code, and symptoms reported by the user...',
                                'Terangkan masalah, kod ralat, dan simptom yang dilaporkan oleh pengguna...'
                            )}
                            className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                        />
                        {errors.problem_description && (
                            <span className="text-error text-body-sm">{errors.problem_description}</span>
                        )}
                    </div>

                    {/* Initial Action Taken */}
                    <div className="flex flex-col gap-space-xs">
                        <label className="font-label-md text-label-md text-secondary font-medium" htmlFor="action_taken">
                            {tr('Initial Action Taken', 'Tindakan Awal Diambil')}
                        </label>
                        <textarea
                            id="action_taken"
                            rows={3}
                            value={data.action_taken}
                            onChange={(e) => setData('action_taken', e.target.value)}
                            placeholder={tr(
                                'Optional: Note any troubleshooting steps already performed...',
                                'Pilihan: Catatkan sebarang langkah penyelesaian awal yang telah dilakukan...'
                            )}
                            className="p-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-outline-variant">
                        <Link
                            href={route('tasks.index')}
                            className="h-9 px-space-lg rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-label-md text-label-md inline-flex items-center justify-center transition-colors"
                        >
                            {tr('Cancel', 'Batal')}
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-9 px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold inline-flex items-center gap-space-xs shadow-sm transition-colors disabled:opacity-60"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            <span>
                                {processing
                                    ? tr('Saving...', 'Sedang Menyimpan...')
                                    : tr('Register Incident', 'Daftar Insiden')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

