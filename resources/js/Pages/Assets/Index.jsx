import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AssetsIndex({ assets = [] }) {
    const { tr, translateStatus, translateCategory, translateDepartment } = useLanguage();

    return (
        <AuthenticatedLayout>
            <Head title={tr('Assets - IT Support Tracker', 'Aset - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full gap-space-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm">
                    <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[22px]">devices</span>
                        </div>
                        <div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                                {tr('Hardware Assets Directory', 'Direktori Aset Perkakasan')}
                            </h1>
                            <p className="font-body-sm text-body-sm text-secondary">
                                {tr(
                                    'Monitored peripherals, workstations, network switches, and server infrastructure',
                                    'Peranti sampingan, stesen kerja, suis rangkaian, dan infrastruktur pelayan yang dipantau'
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low h-9 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                                    <th className="px-space-md py-space-xs">{tr('Asset Tag', 'Tag Aset')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Type', 'Jenis')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Model', 'Model')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Department', 'Jabatan')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Location', 'Lokasi')}</th>
                                    <th className="px-space-md py-space-xs">{tr('Status', 'Status')}</th>
                                    <th className="px-space-md py-space-xs text-right">{tr('Action', 'Tindakan')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
                                {assets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        className="h-11 hover:bg-surface-container-low/60 transition-colors"
                                    >
                                        <td className="px-space-md py-space-xs font-mono-data text-mono-data font-semibold">
                                            <Link
                                                href={route('assets.show', asset.id)}
                                                className="text-primary hover:underline flex items-center gap-1"
                                            >
                                                {asset.asset_tag}
                                            </Link>
                                        </td>
                                        <td className="px-space-md py-space-xs text-on-surface">
                                            {translateCategory(asset.type)}
                                        </td>
                                        <td className="px-space-md py-space-xs text-on-surface font-medium">
                                            {asset.model}
                                        </td>
                                        <td className="px-space-md py-space-xs text-secondary">
                                            {translateDepartment(asset.department)}
                                        </td>
                                        <td className="px-space-md py-space-xs text-secondary">{asset.location}</td>
                                        <td className="px-space-md py-space-xs">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 h-[22px] rounded-full text-label-sm font-label-sm bg-surface-container-low text-secondary font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                {translateStatus(asset.operational_status)}
                                            </span>
                                        </td>
                                        <td className="px-space-md py-space-xs text-right">
                                            <Link
                                                href={route('assets.show', asset.id)}
                                                className="text-primary hover:text-primary-container font-label-md text-label-md font-semibold"
                                            >
                                                {tr('Inspect →', 'Periksa →')}
                                            </Link>
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
