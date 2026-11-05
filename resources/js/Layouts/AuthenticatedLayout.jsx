import { LanguageSwitcher, useLanguage } from '@/Contexts/LanguageContext';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const { tr } = useLanguage();
    const user = auth?.user || { name: 'Alex Mercer', role: 'Staff' };
    const currentUrl = usePage().url;

    const navItems = [
        {
            name: tr('Dashboard', 'Dashboard'),
            href: route('dashboard'),
            icon: 'dashboard',
            active: currentUrl.startsWith('/dashboard'),
        },
        {
            name: tr('Register Incident', 'Daftar Insiden'),
            href: route('tasks.create'),
            icon: 'add_task',
            active: currentUrl.startsWith('/tasks/create'),
        },
        {
            name: tr('Incident List', 'Senarai Insiden'),
            href: route('tasks.index'),
            icon: 'checklist',
            active: currentUrl.startsWith('/tasks') && !currentUrl.startsWith('/tasks/create'),
        },
        {
            name: tr('Report', 'Laporan'),
            href: route('reports.index'),
            icon: 'bar_chart',
            active: currentUrl.startsWith('/reports'),
        },
        {
            name: tr('Knowledge Base', 'Pangkalan Ilmu'),
            href: route('knowledge-base.index'),
            icon: 'menu_book',
            active: currentUrl.startsWith('/knowledge-base'),
        },
        {
            name: tr('Profile', 'Profil'),
            href: route('profile.edit'),
            icon: 'person',
            active: currentUrl.startsWith('/profile'),
        },
    ];

    const roleLabel =
        (user.role || 'Staff') === 'Administrator'
            ? tr('Administrator', 'Pentadbir')
            : tr('Staff', 'Staf');

    return (
        <div className="min-h-screen bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
            <header className="fixed top-0 left-0 w-full h-[52px] bg-surface-container-lowest border-b border-outline-variant z-50 px-margin flex items-center justify-between">
                <Link href={route('dashboard')} className="flex items-center gap-space-sm">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary text-[16px]">terminal</span>
                    </div>
                    <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                        {tr('IT Support Tracker', 'Sistem Jejak Sokongan IT')}
                    </span>
                </Link>
                <div className="flex items-center gap-space-md">
                    <LanguageSwitcher />
                    <div className="flex items-center gap-space-xs font-body-md text-body-md text-on-surface-variant">
                        <span className="font-semibold text-on-surface">{user.name}</span>
                        <span className="text-outline">·</span>
                        <span className="font-label-md text-label-md text-secondary">{roleLabel}</span>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="font-body-md text-body-md text-primary hover:text-primary-container transition-colors"
                    >
                        {tr('Log out', 'Log keluar')}
                    </Link>
                    <Link
                        href={route('profile.edit')}
                        title={tr('Profile settings', 'Tetapan profil')}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors"
                    >
                        <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
                    </Link>
                </div>
            </header>

            <aside className="fixed left-0 top-[52px] h-[calc(100vh-52px)] w-[220px] bg-surface-container-low border-r border-outline-variant z-40 flex flex-col p-space-sm">
                <nav className="flex-1 flex flex-col gap-space-xs">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={item.active ? 'page' : undefined}
                            className={
                                item.active
                                    ? 'flex items-center h-8 px-space-sm rounded-lg transition-colors bg-surface-container-highest text-on-surface font-semibold'
                                    : 'flex items-center h-8 px-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors'
                            }
                        >
                            <span className="material-symbols-outlined text-[18px] mr-space-sm text-secondary">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="pt-space-sm border-t border-outline-variant flex items-center justify-between px-space-xs font-mono-data text-mono-data text-secondary">
                    <span className="text-label-sm font-label-sm uppercase tracking-wider text-outline">
                        {tr('System v2.4', 'Sistem v2.4')}
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                </div>
            </aside>

            <div className="pl-[220px]">
                <main className="w-full min-h-[calc(100vh-52px)] pt-[52px] p-margin bg-surface">
                    {flash?.success && (
                        <div className="mb-space-md px-space-md py-space-sm rounded-lg bg-surface-container border border-primary/30 text-primary font-body-md text-body-md flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-space-xs">
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {header && <div className="mb-space-md">{header}</div>}
                    {children}
                </main>
            </div>
        </div>
    );
}
