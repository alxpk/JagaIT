import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { tr } = useLanguage();

    return (
        <AuthenticatedLayout>
            <Head title={tr('Profile - IT Support Tracker', 'Profil - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full max-w-4xl mx-auto gap-space-lg">
                {/* Page Header */}
                <div className="flex items-center gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/40">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[22px]">person</span>
                    </div>
                    <div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            {tr('Profile', 'Profil')}
                        </h1>
                        <p className="font-body-sm text-body-sm text-secondary">
                            {tr(
                                'Manage your staff account information and security password',
                                'Urus maklumat akaun staf dan kata laluan keselamatan anda'
                            )}
                        </p>
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-space-xl shadow-sm rounded-lg border border-outline-variant/40">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-surface-container-lowest p-space-xl shadow-sm rounded-lg border border-outline-variant/40">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-surface-container-lowest p-space-xl shadow-sm rounded-lg border border-outline-variant/40">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
