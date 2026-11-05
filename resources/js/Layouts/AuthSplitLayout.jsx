import { LanguageSwitcher, useLanguage } from '@/Contexts/LanguageContext';

/**
 * Shared two-column card layout used by Login, AdminLogin, and Register pages.
 * Keeps the illustration, language toggle, and background theme in one place for easy maintenance.
 */
export default function AuthSplitLayout({
    variant = 'member', // 'member' | 'admin' | 'register'
    statusText,
    description,
    topLeftBadge = null,
    children,
}) {
    const { tr } = useLanguage();
    const isAdmin = variant === 'admin';

    const backgroundClass = isAdmin
        ? 'bg-gradient-to-br from-[#00112b] via-on-primary-fixed to-primary'
        : 'bg-gradient-to-br from-on-primary-fixed via-primary to-primary-container';

    return (
        <div
            className={`min-h-screen w-full ${backgroundClass} font-body-md text-on-surface antialiased flex items-center justify-center p-6`}
        >
            <main className="relative w-full max-w-[900px] min-h-[540px] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 grid grid-cols-1 md:grid-cols-2 px-8 py-12 md:px-14 md:py-14 items-center gap-10">
                {/* Optional top-left badge (used on Admin Login) */}
                {topLeftBadge && (
                    <div className="absolute top-5 left-6 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-mono-data text-[11px] font-semibold">
                        {topLeftBadge}
                    </div>
                )}

                {/* Top-right Dwibahasa (BM / EG) Switcher */}
                <div className="absolute top-5 right-6 flex items-center gap-2">
                    <span className="font-mono-data text-label-sm text-secondary uppercase hidden sm:inline">
                        {tr('Language', 'Bahasa')}:
                    </span>
                    <LanguageSwitcher />
                </div>

                {/* Left Column: Laptop Illustration & Portal Status */}
                <div className="flex flex-col items-center justify-center relative select-none mt-4 sm:mt-0">
                    <div className="relative w-64 h-64 rounded-full bg-surface-container-low flex items-center justify-center">
                        {/* Decorative geometric accents */}
                        <span className="w-4 h-4 rounded-full border-2 border-primary-container absolute top-5 left-3" />
                        <span className="w-2.5 h-2.5 border border-outline-variant absolute -top-2 right-12" />
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-primary absolute bottom-5 right-4" />

                        {/* Laptop Screen & Base */}
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-28 rounded-t-md bg-inverse-surface border-4 border-inverse-surface shadow-md flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-[#2b3c52] flex flex-col items-center justify-center relative">
                                    {isAdmin ? (
                                        <>
                                            <span className="material-symbols-outlined text-[36px] text-inverse-primary">
                                                admin_panel_settings
                                            </span>
                                            <span className="mt-1 font-mono-data text-[9px] tracking-widest text-primary-fixed uppercase">
                                                ROOT // AUTH
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-7 h-7 rounded-full border-2 border-surface-container-high mb-1" />
                                            <div className="w-12 h-5 rounded-t-full border-2 border-surface-container-high" />
                                            {variant === 'register' && (
                                                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[13px] font-bold absolute top-3 right-6">
                                                    +
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="w-48 h-3 bg-surface-container-highest rounded-b-md flex items-start justify-center shadow-sm">
                                <div className="w-8 h-1 bg-secondary-fixed-dim rounded-b" />
                            </div>
                        </div>
                    </div>

                    {/* Portal Status Pill */}
                    {statusText && (
                        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/60">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-mono-data text-label-sm text-secondary uppercase tracking-wider">
                                {statusText}
                            </span>
                        </div>
                    )}

                    {/* Optional short description below pill */}
                    {description && (
                        <p className="mt-3 max-w-[250px] text-center font-body-sm text-body-sm text-secondary leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Right Column: Form Content */}
                <div className="flex flex-col items-center justify-between h-full w-full max-w-[330px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

