import AuthPillInput from '@/Components/AuthPillInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLogin({ status }) {
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);
    const { tr } = useLanguage();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@department.gov',
        password: 'password',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    const getEmailError = () => {
        if (!errors.email) {
            return null;
        }
        if (errors.email.includes('Administrator accounts only')) {
            return tr(
                'Access denied. This portal is restricted to Administrator accounts only.',
                'Akses ditolak. Portal ini dihadkan kepada akaun Pentadbir sahaja.'
            );
        }
        return errors.email;
    };

    const clearanceBadge = (
        <>
            <span className="material-symbols-outlined text-[14px] text-primary">
                verified_user
            </span>
            <span>{tr('CLEARANCE: LEVEL-4 ADMIN', 'KELULUSAN: ADMIN TAHAP-4')}</span>
        </>
    );

    return (
        <>
            <Head
                title={tr(
                    'Administrator Login - IT Support Tracker',
                    'Log Masuk Pentadbir - Sistem Jejak Sokongan IT'
                )}
            />

            <AuthSplitLayout
                variant="admin"
                topLeftBadge={clearanceBadge}
                statusText={tr('ADMIN_GATEWAY // SECURE NODE-01', 'GERBANG_ADMIN // NOD SELAMAT-01')}
                description={tr(
                    'Privileged access for IT System Administrators. All administrative actions are logged.',
                    'Akses istimewa untuk Pentadbir Sistem IT. Semua tindakan pentadbiran direkodkan.'
                )}
            >
                <div className="w-full flex flex-col items-center my-auto">
                    <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-2.5 shadow-sm">
                        <span className="material-symbols-outlined text-[22px]">
                            shield_person
                        </span>
                    </div>

                    <h1 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight text-center mb-1">
                        {tr('Administrator Login', 'Log Masuk Pentadbir')}
                    </h1>
                    <p className="font-body-sm text-body-sm text-secondary text-center mb-6">
                        {tr(
                            'Elevated Console · ENC-256 Protected',
                            'Konsol Tahap Tinggi · Dilindungi ENC-256'
                        )}
                    </p>

                    {status && (
                        <div className="mb-4 w-full text-center text-body-sm font-medium text-primary bg-surface-container-low py-1.5 px-3 rounded-full">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
                        <AuthPillInput
                            id="admin-email"
                            name="email"
                            type="email"
                            icon="admin_panel_settings"
                            required
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={tr('Admin Email', 'E-mel Pentadbir')}
                            error={getEmailError()}
                        />

                        <AuthPillInput
                            id="admin-password"
                            name="password"
                            type="password"
                            icon="key"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={tr('Admin Password', 'Kata Laluan Pentadbir')}
                            error={errors.password}
                        />

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 rounded-full bg-on-primary-fixed hover:bg-primary text-on-primary font-label-md text-[13px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-[17px]">lock_open</span>
                                <span>
                                    {processing
                                        ? tr('VERIFYING CLEARANCE...', 'MENGESAHKAN KELULUSAN...')
                                        : tr('AUTHORIZE & LOGIN', 'SAHKAN & LOG MASUK')}
                                </span>
                            </button>
                        </div>
                    </form>

                    {/* Admin Security Policy Info */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setShowSecurityInfo((prev) => !prev)}
                            className="font-body-sm text-body-sm text-outline hover:text-primary transition-colors"
                        >
                            {tr('Admin Security', 'Keselamatan Admin')}{' '}
                            <span className="text-secondary font-medium">
                                {tr('Clearance Policy?', 'Polisi Kelulusan?')}
                            </span>
                        </button>

                        {showSecurityInfo && (
                            <p className="mt-2 text-label-sm text-secondary bg-surface-container-low px-3 py-2 rounded-lg">
                                {tr(
                                    'Default Admin: admin@department.gov (password: password). Non-admin accounts will be rejected.',
                                    'Admin Lalai: admin@department.gov (kata laluan: password). Akaun bukan admin akan ditolak.'
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Back to Member Login Link */}
                <div className="pt-8 flex flex-col items-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-secondary hover:text-primary font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        <span>{tr('Back to Member Login', 'Kembali ke Log Masuk Ahli')}</span>
                    </Link>
                </div>
            </AuthSplitLayout>
        </>
    );
}
