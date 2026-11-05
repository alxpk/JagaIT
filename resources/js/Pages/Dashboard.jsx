import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({
    period = 'week',
    metrics,
    categories = [],
    waitingOnHq = [],
    repeatFailureAssets = [],
}) {
    const { tr, translateStatus, translateCategory, translateDepartment } = useLanguage();

    const handlePeriodChange = (e) => {
        router.get(route('dashboard'), { period: e.target.value }, { preserveState: true, preserveScroll: true });
    };

    const handleExportReport = () => {
        const rows = [
            ['Task Code', 'Escalated On', 'Days Waiting', 'Status'],
            ...waitingOnHq.map((item) => [item.task_code, item.escalated_on, item.days_waiting, item.status]),
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `hq-dashboard-report-${period}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout>
            <Head title={tr('Dashboard (Administrator View)', 'Papan Pemuka (Paparan Pentadbir)')} />

            <div className="flex flex-col w-full gap-space-lg">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs text-secondary font-mono-data text-label-sm uppercase tracking-wider">
                            <span>{tr('HQ Portal', 'Portal HQ')}</span>
                            <span>/</span>
                            <span>{tr('Overview', 'Ringkasan')}</span>
                            <span>/</span>
                            <span className="text-primary font-semibold">{tr('Live Feed', 'Suapan Langsung')}</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            {tr('Dashboard (Administrator View)', 'Papan Pemuka (Paparan Pentadbir)')}
                        </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-space-sm self-start md:self-auto">
                        <div className="relative">
                            <select
                                value={period}
                                onChange={handlePeriodChange}
                                className="appearance-none bg-surface-container-lowest text-on-surface font-body-md text-body-md h-8 pl-space-md pr-8 rounded-lg shadow-sm border border-outline-variant/60 focus:outline-none focus:bg-surface-container-lowest transition-colors cursor-pointer"
                            >
                                <option value="week">{tr('This week', 'Minggu ini')}</option>
                                <option value="month">{tr('This month', 'Bulan ini')}</option>
                                <option value="custom">{tr('Custom range', 'Julat khas')}</option>
                            </select>
                            <span className="material-symbols-outlined text-[16px] text-secondary absolute right-2 top-2 pointer-events-none">
                                expand_more
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleExportReport}
                            className="flex items-center gap-space-xs h-8 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md hover:bg-surface-container-low transition-colors shadow-sm focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[16px] text-secondary">download</span>
                            <span>{tr('Export report', 'Eksport laporan')}</span>
                        </button>
                    </div>
                </div>

                {/* Four Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    {/* Card 1: Tasks logged */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-md text-label-md text-secondary">
                                {tr('Tasks logged', 'Tugasan direkodkan')}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-secondary">assignment</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-space-xs">
                            <span className="font-headline-xl text-headline-xl text-on-surface font-mono-data">
                                {metrics?.tasksLogged ?? 48}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                {tr('+12% vs last week', '+12% berbanding minggu lalu')}
                            </span>
                        </div>
                        <div className="mt-space-sm h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: '72%' }}></div>
                        </div>
                    </div>

                    {/* Card 2: Resolved locally */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-md text-label-md text-secondary">
                                {tr('Resolved locally', 'Diselesaikan secara lokal')}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-secondary">task_alt</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-space-xs">
                            <span className="font-headline-xl text-headline-xl text-on-surface font-mono-data">
                                {metrics?.resolvedLocally ?? 39}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-mono-data">
                                {metrics?.resolvedPercentage ?? '81.2%'}
                            </span>
                        </div>
                        <div className="mt-space-sm h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: '81.2%' }}></div>
                        </div>
                    </div>

                    {/* Card 3: Escalated to HQ */}
                    <div className="bg-surface-container rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-md text-label-md text-primary font-semibold">
                                {tr('Escalated to HQ', 'Dinaikkan ke HQ')}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                                {tr('Active Action', 'Tindakan Aktif')}
                            </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-space-xs">
                            <span className="font-headline-xl text-headline-xl text-primary font-mono-data font-bold">
                                {metrics?.escalatedToHq ?? '09'}
                            </span>
                            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {tr('Requires Sync', 'Perlu Penyegerakan')}
                            </span>
                        </div>
                        <div className="mt-space-sm h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                        </div>
                    </div>

                    {/* Card 4: Average HQ response */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col justify-between shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-space-xs">
                            <span className="font-label-md text-label-md text-secondary">
                                {tr('Average HQ response (days)', 'Purata maklum balas HQ (hari)')}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-secondary">pace</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-space-xs">
                            <span className="font-headline-xl text-headline-xl text-on-surface font-mono-data">
                                {metrics?.avgHqResponseDays ?? '2.4'}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-mono-data">
                                {tr('Target: < 3.0 d', 'Sasaran: < 3.0 h')}
                            </span>
                        </div>
                        <div className="mt-space-sm h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: '80%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Analytical Visual Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
                    {/* Left Panel: Weekly volume chart */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Tasks per week (Last 6 weeks)', 'Tugasan setiap minggu (6 minggu lepas)')}
                                </h2>
                                <p className="font-body-sm text-body-sm text-secondary">
                                    {tr(
                                        'Cumulative local and HQ ticket volume',
                                        'Jumlah terkumpul tiket lokal dan HQ'
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-space-sm text-label-sm font-label-sm text-secondary font-mono-data">
                                <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-secondary-container inline-block"></span>
                                    {tr('Past', 'Lepas')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block"></span>
                                    {tr('Current', 'Semasa')}
                                </span>
                            </div>
                        </div>

                        {/* SVG Technical Bar Chart */}
                        <div className="relative w-full h-48 pt-2">
                            <svg
                                aria-label="Tasks per week bar chart"
                                className="w-full h-full"
                                preserveAspectRatio="none"
                                viewBox="0 0 540 180"
                            >
                                <line
                                    className="text-surface-container-highest"
                                    stroke="currentColor"
                                    strokeDasharray="2 2"
                                    strokeWidth="1"
                                    x1="30"
                                    x2="520"
                                    y1="20"
                                    y2="20"
                                />
                                <text
                                    className="text-secondary font-mono-data fill-current"
                                    fontSize="10"
                                    textAnchor="end"
                                    x="24"
                                    y="23"
                                >
                                    60
                                </text>
                                <line
                                    className="text-surface-container-highest"
                                    stroke="currentColor"
                                    strokeDasharray="2 2"
                                    strokeWidth="1"
                                    x1="30"
                                    x2="520"
                                    y1="65"
                                    y2="65"
                                />
                                <text
                                    className="text-secondary font-mono-data fill-current"
                                    fontSize="10"
                                    textAnchor="end"
                                    x="24"
                                    y="68"
                                >
                                    40
                                </text>
                                <line
                                    className="text-surface-container-highest"
                                    stroke="currentColor"
                                    strokeDasharray="2 2"
                                    strokeWidth="1"
                                    x1="30"
                                    x2="520"
                                    y1="110"
                                    y2="110"
                                />
                                <text
                                    className="text-secondary font-mono-data fill-current"
                                    fontSize="10"
                                    textAnchor="end"
                                    x="24"
                                    y="113"
                                >
                                    20
                                </text>
                                <line
                                    className="text-surface-container-highest"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    x1="30"
                                    x2="520"
                                    y1="155"
                                    y2="155"
                                />
                                <text
                                    className="text-secondary font-mono-data fill-current"
                                    fontSize="10"
                                    textAnchor="end"
                                    x="24"
                                    y="158"
                                >
                                    0
                                </text>

                                {/* Wk 1 */}
                                <g className="transition-all hover:opacity-80 cursor-pointer">
                                    <rect
                                        className="fill-current text-secondary-container"
                                        height="72"
                                        rx="4"
                                        width="46"
                                        x="58"
                                        y="83"
                                    />
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="81"
                                        y="75"
                                    >
                                        32
                                    </text>
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="81"
                                        y="172"
                                    >
                                        {tr('Wk 1', 'Mg 1')}
                                    </text>
                                </g>
                                {/* Wk 2 */}
                                <g className="transition-all hover:opacity-80 cursor-pointer">
                                    <rect
                                        className="fill-current text-secondary-container"
                                        height="85.5"
                                        rx="4"
                                        width="46"
                                        x="138"
                                        y="69.5"
                                    />
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="161"
                                        y="61"
                                    >
                                        38
                                    </text>
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="161"
                                        y="172"
                                    >
                                        {tr('Wk 2', 'Mg 2')}
                                    </text>
                                </g>
                                {/* Wk 3 */}
                                <g className="transition-all hover:opacity-80 cursor-pointer">
                                    <rect
                                        className="fill-current text-secondary-container"
                                        height="92"
                                        rx="4"
                                        width="46"
                                        x="218"
                                        y="63"
                                    />
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="241"
                                        y="55"
                                    >
                                        41
                                    </text>
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="241"
                                        y="172"
                                    >
                                        {tr('Wk 3', 'Mg 3')}
                                    </text>
                                </g>
                                {/* Wk 4 */}
                                <g className="transition-all hover:opacity-80 cursor-pointer">
                                    <rect
                                        className="fill-current text-secondary-container"
                                        height="78.5"
                                        rx="4"
                                        width="46"
                                        x="298"
                                        y="76.5"
                                    />
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="321"
                                        y="68"
                                    >
                                        35
                                    </text>
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="321"
                                        y="172"
                                    >
                                        {tr('Wk 4', 'Mg 4')}
                                    </text>
                                </g>
                                {/* Wk 5 */}
                                <g className="transition-all hover:opacity-80 cursor-pointer">
                                    <rect
                                        className="fill-current text-secondary-container"
                                        height="99"
                                        rx="4"
                                        width="46"
                                        x="378"
                                        y="56"
                                    />
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="401"
                                        y="48"
                                    >
                                        44
                                    </text>
                                    <text
                                        className="text-secondary font-mono-data fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="401"
                                        y="172"
                                    >
                                        {tr('Wk 5', 'Mg 5')}
                                    </text>
                                </g>
                                {/* Wk 6 (Current) */}
                                <g className="transition-all hover:opacity-90 cursor-pointer">
                                    <rect
                                        className="fill-current text-primary"
                                        height="108"
                                        rx="4"
                                        width="46"
                                        x="458"
                                        y="47"
                                    />
                                    <text
                                        className="text-primary font-mono-data font-bold fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="481"
                                        y="39"
                                    >
                                        48
                                    </text>
                                    <text
                                        className="text-primary font-mono-data font-semibold fill-current"
                                        fontSize="11"
                                        textAnchor="middle"
                                        x="481"
                                        y="172"
                                    >
                                        {tr('Wk 6', 'Mg 6')}
                                    </text>
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* Right Panel: Tasks by Category */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                            <div>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Tasks by category', 'Tugasan mengikut kategori')}
                                </h2>
                                <p className="font-body-sm text-body-sm text-secondary">
                                    {tr(
                                        'Categorical distribution for the active period',
                                        'Taburan kategori bagi tempoh aktif'
                                    )}
                                </p>
                            </div>
                            <span className="font-mono-data text-label-sm text-secondary">
                                {tr('Total: 48', 'Jumlah: 48')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-space-md my-auto">
                            {categories.map((cat) => (
                                <div key={cat.name} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-body-md font-body-md">
                                        <span className="flex items-center gap-space-xs text-on-surface font-medium">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                                {cat.icon}
                                            </span>
                                            {translateCategory(cat.name)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono-data text-label-md text-secondary">
                                                {cat.logs} {tr('logs', 'rekod')}
                                            </span>
                                            <span className="font-mono-data text-label-md text-on-surface font-semibold w-10 text-right">
                                                {cat.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                                        <div
                                            className={`h-full ${cat.barClass} rounded-full transition-all duration-500`}
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Operational Data Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
                    {/* Left Table: Waiting on HQ */}
                    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div className="p-space-md flex items-center justify-between">
                            <div className="flex items-center gap-space-xs">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Waiting on HQ', 'Menunggu Tindakan HQ')}
                                </h2>
                            </div>
                            <span className="font-mono-data text-label-sm text-secondary">
                                {waitingOnHq.length} {tr('critical records', 'rekod kritikal')}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                                        <th className="py-2.5 px-space-md">{tr('Task', 'Tugasan')}</th>
                                        <th className="py-2.5 px-space-md">{tr('Escalated On', 'Tarikh Dinaikkan')}</th>
                                        <th className="py-2.5 px-space-md">{tr('Days Waiting', 'Hari Menunggu')}</th>
                                        <th className="py-2.5 px-space-md text-right">{tr('Status', 'Status')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-0 text-body-md font-body-md">
                                    {waitingOnHq.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-surface-container-low transition-colors"
                                        >
                                            <td className="py-2.5 px-space-md">
                                                <Link
                                                    href={route('tasks.show', item.id)}
                                                    className="font-mono-data text-primary font-medium hover:underline"
                                                >
                                                    {item.task_code}
                                                </Link>
                                            </td>
                                            <td className="py-2.5 px-space-md font-mono-data text-secondary">
                                                {item.escalated_on}
                                            </td>
                                            <td className="py-2.5 px-space-md font-mono-data text-on-surface">
                                                {item.days_waiting.replace('days', tr('days', 'hari'))}
                                            </td>
                                            <td className="py-2.5 px-space-md text-right">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                                    {translateStatus(item.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Table: Repeat-failure assets */}
                    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div className="p-space-md flex items-center justify-between">
                            <div className="flex items-center gap-space-xs">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                    {tr('Repeat-failure assets', 'Aset kerosakan berulang')}
                                </h2>
                            </div>
                            <span className="font-mono-data text-label-sm text-secondary">
                                {tr('Threshold: > 2 jobs', 'Ambang: > 2 kerja')}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                                        <th className="py-2.5 px-space-md">{tr('Asset Tag', 'Tag Aset')}</th>
                                        <th className="py-2.5 px-space-md">{tr('Department', 'Jabatan')}</th>
                                        <th className="py-2.5 px-space-md">{tr('Incident Count', 'Bilangan Insiden')}</th>
                                        <th className="py-2.5 px-space-md text-right">{tr('Telemetry', 'Telemetri')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-0 text-body-md font-body-md">
                                    {repeatFailureAssets.map((asset) => (
                                        <tr
                                            key={asset.id}
                                            className="hover:bg-surface-container-low transition-colors"
                                        >
                                            <td className="py-2.5 px-space-md">
                                                <Link
                                                    href={route('assets.show', asset.id)}
                                                    className="flex items-center gap-1.5 font-mono-data text-primary font-medium hover:underline"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] text-secondary">
                                                        devices
                                                    </span>
                                                    {asset.asset_tag}
                                                </Link>
                                            </td>
                                            <td className="py-2.5 px-space-md text-on-surface">
                                                {translateDepartment(asset.department)}
                                            </td>
                                            <td className="py-2.5 px-space-md">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-secondary font-mono-data text-label-sm">
                                                    {asset.jobs_label.replace('jobs in 30d', tr('jobs in 30d', 'kerja dlm 30h'))}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-space-md text-right">
                                                <Link
                                                    href={route('assets.show', asset.id)}
                                                    className="text-primary hover:text-primary-container font-label-sm text-label-sm font-medium"
                                                >
                                                    {tr('Inspect', 'Periksa')}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
