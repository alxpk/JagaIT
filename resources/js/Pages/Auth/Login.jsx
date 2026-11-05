import AuthPillInput from '@/Components/AuthPillInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const [showResetNotice, setShowResetNotice] = useState(false);
    const { tr } = useLanguage();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'alex.mercer@department.gov',
        password: 'password',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={tr('Log in - IT Support Tracker', 'Log Masuk - Sistem Jejak Sokongan IT')} />

            <AuthSplitLayout
                variant="member"
                statusText={tr('IT SUPPORT TRACKER // NODE-04', 'JEJAK SOKONGAN IT // NOD-04')}
            >
                <div className="w-full flex flex-col items-center my-auto">
                    <h1 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight text-center mb-1">
                        {tr('Member Login', 'Log Masuk Ahli')}
                    </h1>
                    <p className="font-body-sm text-body-sm text-secondary text-center mb-7">
                        {tr(
                            'IT Support Tracker · Authorized Staff Portal',
                            'Sistem Jejak Sokongan IT · Portal Staf Sah'
                        )}
                    </p>

                    {status && (
                        <div className="mb-4 w-full text-center text-body-sm font-medium text-primary bg-surface-container-low py-1.5 px-3 rounded-full">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
                        <AuthPillInput
                            id="email-address"
                            name="email"
                            type="email"
                            icon="mail"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={tr('Email', 'Alamat E-mel')}
                            error={errors.email}
                        />

                        <AuthPillInput
                            id="account-password"
                            name="password"
                            type="password"
                            icon="lock"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={tr('Password', 'Kata Laluan')}
                            error={errors.password}
                        />

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-[13px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center disabled:opacity-60"
                            >
                                {processing
                                    ? tr('LOGGING IN...', 'SEDANG LOG MASUK...')
                                    : tr('LOGIN', 'LOG MASUK')}
                            </button>
                        </div>
                    </form>

                    {/* Forgot Username / Password Helper */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setShowResetNotice((prev) => !prev)}
                            className="font-body-sm text-body-sm text-outline hover:text-primary transition-colors"
                        >
                            {tr('Forgot', 'Lupa')}{' '}
                            <span className="text-secondary font-medium">
                                {tr('Username / Password?', 'Nama Pengguna / Kata Laluan?')}
                            </span>
                        </button>

                        {showResetNotice && (
                            <p className="mt-2 text-label-sm text-secondary bg-surface-container-low px-3 py-2 rounded-lg">
                                {tr(
                                    'Ask the administrator to reset a forgotten password. Sessions end after 30 minutes of inactivity.',
                                    'Hubungi pentadbir untuk menetapkan semula kata laluan. Sesi tamat selepas 30 minit tidak aktif.'
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation Links */}
                <div className="pt-10 flex flex-col items-center gap-2">
                    <Link
                        href={route('admin.login')}
                        className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-secondary hover:text-primary font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px] text-primary">
                            admin_panel_settings
                        </span>
                        <span>{tr('Administrator Login', 'Log Masuk Pentadbir')}</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>

                    <Link
                        href={route('register')}
                        className="inline-flex items-center gap-1 font-label-sm text-label-sm text-outline hover:text-primary transition-colors"
                    >
                        <span>{tr('Create your Account', 'Cipta Akaun Anda')}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                </div>
            </AuthSplitLayout>
        </>
    );
}
