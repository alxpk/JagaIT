import AuthPillInput from '@/Components/AuthPillInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { tr } = useLanguage();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        department: 'IT Support',
        role: 'Staff',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const departments = [
        { value: 'IT Support', label: tr('IT Support', 'Sokongan IT') },
        { value: 'Network Operations', label: tr('Network Operations', 'Operasi Rangkaian') },
        { value: 'Finance', label: tr('Finance', 'Kewangan') },
        { value: 'Human Resources', label: tr('Human Resources', 'Sumber Manusia') },
        { value: 'Administration', label: tr('Administration', 'Pentadbiran') },
        { value: 'Operations', label: tr('Operations', 'Operasi') },
    ];

    return (
        <>
            <Head title={tr('Create Account - IT Support Tracker', 'Cipta Akaun - Sistem Jejak Sokongan IT')} />

            <AuthSplitLayout
                variant="register"
                statusText={tr('STAFF PROVISIONING // NODE-04', 'PENDAFTARAN STAF // NOD-04')}
                description={tr(
                    'Register your department credentials to manage support tickets, hardware assets, and maintenance schedules.',
                    'Daftarkan kelayakan jabatan anda untuk mengurus tiket sokongan, aset perkakasan, dan jadual penyelenggaraan.'
                )}
            >
                <div className="w-full flex flex-col items-center my-auto">
                    <h1 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight text-center mb-1">
                        {tr('Create Account', 'Cipta Akaun')}
                    </h1>
                    <p className="font-body-sm text-body-sm text-secondary text-center mb-6">
                        {tr(
                            'IT Support Tracker · New Staff Registration',
                            'Sistem Jejak Sokongan IT · Pendaftaran Staf Baharu'
                        )}
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                        <AuthPillInput
                            id="name"
                            name="name"
                            type="text"
                            icon="person"
                            required
                            autoFocus
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={tr('Full Name', 'Nama Penuh')}
                            error={errors.name}
                        />

                        <AuthPillInput
                            id="email"
                            name="email"
                            type="email"
                            icon="mail"
                            required
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={tr(
                                'Official Email (name@department.gov)',
                                'E-mel Rasmi (nama@department.gov)'
                            )}
                            error={errors.email}
                        />

                        {/* Department & Role Selectors */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 relative flex items-center">
                                <span className="material-symbols-outlined text-[17px] text-secondary absolute left-4 pointer-events-none">
                                    apartment
                                </span>
                                <select
                                    id="department"
                                    name="department"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    aria-label={tr('Department', 'Jabatan')}
                                    className="w-full h-11 pl-10 pr-6 rounded-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm outline-none appearance-none truncate"
                                >
                                    {departments.map((dept) => (
                                        <option key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1">
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    aria-label={tr('Role', 'Peranan')}
                                    className="w-full h-11 px-3 rounded-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-medium outline-none appearance-none text-center"
                                >
                                    <option value="Staff">{tr('Staff', 'Staf')}</option>
                                    <option value="Admin">{tr('Admin', 'Admin')}</option>
                                </select>
                            </div>
                        </div>

                        <AuthPillInput
                            id="password"
                            name="password"
                            type="password"
                            icon="lock"
                            required
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={tr('Password', 'Kata Laluan')}
                            error={errors.password}
                        />

                        <AuthPillInput
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            icon="verified_user"
                            required
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder={tr('Confirm Password', 'Sahkan Kata Laluan')}
                            error={errors.password_confirmation}
                        />

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-[13px] font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center disabled:opacity-60"
                            >
                                {processing
                                    ? tr('CREATING ACCOUNT...', 'SEDANG MENCIPTA AKAUN...')
                                    : tr('REGISTER ACCOUNT', 'DAFTAR AKAUN')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back to Login Link */}
                <div className="pt-6 flex flex-col items-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 font-body-sm text-body-sm text-secondary hover:text-primary font-medium transition-colors"
                    >
                        <span>
                            {tr('Already have an account? Log in', 'Sudah mempunyai akaun? Log masuk')}
                        </span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>
            </AuthSplitLayout>
        </>
    );
}
