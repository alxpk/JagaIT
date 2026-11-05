import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({
    lang: 'en',
    setLang: () => {},
    toggleLang: () => {},
    tr: (enText, bmText) => enText,
    translateStatus: (status) => status,
    translateCategory: (cat) => cat,
    translateDepartment: (dept) => dept,
});

const statusTranslations = {
    Open: 'Dibuka',
    'In progress': 'Dalam Proses',
    'Escalated to HQ': 'Dinaikkan ke HQ',
    Resolved: 'Selesai',
    Verified: 'Disahkan',
    Overdue: 'Tertunggak',
    'Due in 3 days': 'Perlu dalam 3 hari',
    Scheduled: 'Dijadualkan',
    'Up to date': 'Terkini',
    'In use': 'Sedang Digunakan',
    Maintenance: 'Penyelenggaraan',
    Standby: 'Tunggu Sedia',
};

const categoryTranslations = {
    Printer: 'Pencetak',
    Network: 'Rangkaian',
    Account: 'Akaun',
    Hardware: 'Perkakasan',
    Software: 'Perisian',
    VPN: 'VPN',
    Workstation: 'Stesen Kerja',
    Server: 'Pelayan',
    'Network switch': 'Suis Rangkaian',
    Peripheral: 'Peranti Sampingan',
    Endpoint: 'Titik Akhir',
    Infrastructure: 'Infrastruktur',
};

const departmentTranslations = {
    Finance: 'Kewangan',
    'Finance Operations': 'Operasi Kewangan',
    Logistics: 'Logistik',
    Legal: 'Perundangan',
    Engineering: 'Kejuruteraan',
    HR: 'Sumber Manusia',
    Registry: 'Pendaftaran',
    Operations: 'Operasi',
};

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('jagait_lang') || 'en';
        }
        return 'en';
    });

    const setLang = (nextLang) => {
        setLangState(nextLang);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('jagait_lang', nextLang);
        }
    };

    const toggleLang = () => {
        setLang(lang === 'en' ? 'bm' : 'en');
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang === 'bm' ? 'ms' : 'en';
        }
    }, [lang]);

    const tr = (enText, bmText) => (lang === 'bm' ? bmText : enText);

    const translateStatus = (status) => {
        if (lang !== 'bm') return status;
        return statusTranslations[status] || status;
    };

    const translateCategory = (cat) => {
        if (lang !== 'bm') return cat;
        return categoryTranslations[cat] || cat;
    };

    const translateDepartment = (dept) => {
        if (lang !== 'bm') return dept;
        return departmentTranslations[dept] || dept;
    };

    return (
        <LanguageContext.Provider
            value={{
                lang,
                setLang,
                toggleLang,
                tr,
                translateStatus,
                translateCategory,
                translateDepartment,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function LanguageSwitcher({ className = '' }) {
    const { lang, setLang } = useLanguage();

    return (
        <div
            className={`inline-flex items-center rounded-full bg-surface-container p-0.5 border border-outline-variant shadow-xs ${className}`}
            role="group"
            aria-label="Language switcher / Penukar bahasa"
        >
            <button
                type="button"
                onClick={() => setLang('bm')}
                title="Bahasa Melayu"
                className={`px-2.5 h-6 rounded-full font-mono-data text-label-sm font-semibold transition-all ${
                    lang === 'bm'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-secondary hover:text-on-surface'
                }`}
            >
                BM
            </button>
            <button
                type="button"
                onClick={() => setLang('en')}
                title="English"
                className={`px-2.5 h-6 rounded-full font-mono-data text-label-sm font-semibold transition-all ${
                    lang === 'en'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-secondary hover:text-on-surface'
                }`}
            >
                EG
            </button>
        </div>
    );
}

