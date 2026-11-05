import { useLanguage } from '@/Contexts/LanguageContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function KnowledgeBaseIndex({ articles = [], selectedArticleId, filters = {} }) {
    const { tr, translateCategory, translateStatus } = useLanguage();
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [activeId, setActiveId] = useState(selectedArticleId || articles[0]?.id || null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const activeArticle = articles.find((a) => a.id === activeId) || articles[0] || null;

    const newArticleForm = useForm({
        title: '',
        category: 'Printer',
        summary: '',
        problem_description: '',
        stepsText: '',
    });

    const editArticleForm = useForm({
        title: activeArticle?.title || '',
        category: activeArticle?.category || 'Printer',
        summary: activeArticle?.summary || '',
        problem_description: activeArticle?.problem_description || '',
        stepsText: (activeArticle?.steps || []).join('\n'),
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('knowledge-base.index'),
            {
                search: search || undefined,
                category: category !== 'all' ? category : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleOpenEdit = () => {
        if (!activeArticle) return;
        editArticleForm.setData({
            title: activeArticle.title,
            category: activeArticle.category,
            summary: activeArticle.summary,
            problem_description: activeArticle.problem_description,
            stepsText: (activeArticle.steps || []).join('\n'),
        });
        setShowEditModal(true);
    };

    const submitNewArticle = (e) => {
        e.preventDefault();
        const steps = newArticleForm.data.stepsText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);

        router.post(
            route('knowledge-base.store'),
            {
                title: newArticleForm.data.title,
                category: newArticleForm.data.category,
                summary: newArticleForm.data.summary,
                problem_description: newArticleForm.data.problem_description,
                steps: steps.length ? steps : ['Apply standard diagnostic procedure.'],
            },
            {
                onSuccess: () => {
                    setShowNewModal(false);
                    newArticleForm.reset();
                },
            }
        );
    };

    const submitEditArticle = (e) => {
        e.preventDefault();
        if (!activeArticle) return;
        const steps = editArticleForm.data.stepsText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);

        router.patch(
            route('knowledge-base.update', activeArticle.id),
            {
                title: editArticleForm.data.title,
                category: editArticleForm.data.category,
                summary: editArticleForm.data.summary,
                problem_description: editArticleForm.data.problem_description,
                steps: steps.length ? steps : ['Apply standard diagnostic procedure.'],
            },
            {
                preserveScroll: true,
                onSuccess: () => setShowEditModal(false),
            }
        );
    };

    const handleHelpful = () => {
        if (!activeArticle) return;
        router.patch(
            route('knowledge-base.update', activeArticle.id),
            { action: 'helpful' },
            { preserveScroll: true }
        );
    };

    const handleLogTaskFromFix = () => {
        if (!activeArticle) return;
        router.post(route('tasks.store'), {
            requester_name: 'Eleanor Vance',
            department: 'Finance',
            category: activeArticle.category || 'Printer',
            problem_description: activeArticle.problem_description,
            action_taken: `Applied verified KB fix ${activeArticle.doc_id}: ${activeArticle.title}`,
            time_spent_minutes: 30,
        });
    };

    const handleCopyLink = () => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
        <AuthenticatedLayout>
            <Head title={tr('Knowledge Base - IT Support Tracker', 'Pangkalan Ilmu - Sistem Jejak Sokongan IT')} />

            <div className="flex flex-col w-full">
                {/* Screen Header */}
                <div className="flex items-center justify-between mb-space-lg">
                    <div className="flex items-center gap-space-sm">
                        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                            {tr('Knowledge Base', 'Pangkalan Ilmu')}
                        </h1>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-mono-data text-label-sm font-semibold">
                            KB-ENG-V4
                        </span>
                    </div>
                    <div className="flex items-center gap-space-sm">
                        <button
                            type="button"
                            onClick={() => setShowNewModal(true)}
                            className="h-8 px-space-md rounded bg-primary text-on-primary font-body-md text-body-md font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {tr('New article', 'Artikel baharu')}
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-space-md mb-space-lg shadow-sm">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm"
                    >
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">
                                search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={tr(
                                    'Search known fixes, error codes, hardware solutions...',
                                    'Cari penyelesaian diketahui, kod ralat, panduan perkakasan...'
                                )}
                                className="w-full h-8 pl-9 pr-3 rounded bg-surface-container-lowest border border-outline-variant font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="relative sm:w-56">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-8 pl-3 pr-8 rounded bg-surface-container-lowest border border-outline-variant font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">{tr('All categories', 'Semua kategori')}</option>
                                <option value="printer">{tr('Printer', 'Pencetak')}</option>
                                <option value="network">{tr('Network', 'Rangkaian')}</option>
                                <option value="account">{tr('Account', 'Akaun')}</option>
                                <option value="hardware">{tr('Hardware', 'Perkakasan')}</option>
                                <option value="vpn">VPN</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">
                                expand_more
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="h-8 px-space-lg rounded bg-surface-container-lowest border border-outline font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors font-medium flex items-center justify-center gap-1.5 focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[16px]">filter_list</span>
                            {tr('Search', 'Cari')}
                        </button>
                    </form>
                </div>

                {/* Split View Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                    {/* Left Column (40% width / 5 Cols): Article Cards Stream */}
                    <div className="lg:col-span-5 flex flex-col gap-space-sm">
                        <div className="flex items-center justify-between px-1 mb-1">
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                                {articles.length} {tr('Results matching query', 'Keputusan sepadan carian')}
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary">
                                {tr('Sort: Last Updated', 'Susun: Kemas Kini Terakhir')}
                            </span>
                        </div>

                        {articles.map((article) => {
                            const isSelected = activeArticle?.id === article.id;
                            return (
                                <article
                                    key={article.id}
                                    onClick={() => setActiveId(article.id)}
                                    className={
                                        isSelected
                                            ? 'p-space-md rounded-lg bg-[#EFF6FF] border border-primary relative cursor-pointer shadow-sm transition-all'
                                            : 'p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant hover:border-outline cursor-pointer shadow-sm transition-all hover:bg-surface-bright'
                                    }
                                >
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                                    )}
                                    <div className="flex items-center justify-between gap-space-xs mb-1.5">
                                        <span
                                            className={
                                                isSelected
                                                    ? 'inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-lowest text-primary border border-primary/30'
                                                    : 'inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-low text-secondary border border-outline-variant'
                                            }
                                        >
                                            {translateCategory(article.category)}
                                        </span>
                                        <span className="font-mono-data text-body-sm text-secondary">
                                            {tr('Updated', 'Dikemas kini')} {article.published_date_label}
                                        </span>
                                    </div>
                                    <h2 className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors leading-snug mb-1">
                                        {article.title}
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-secondary mb-2">
                                        <span className="font-medium text-on-surface">{article.author_name}</span>
                                        <span>·</span>
                                        {article.doc_id === 'KB-4091' ? (
                                            <span className="inline-flex items-center gap-1 text-[#0F766E] font-medium">
                                                <span className="material-symbols-outlined text-[14px]">
                                                    verified
                                                </span>
                                                {tr('Verified fix', 'Penyelesaian disahkan')}
                                            </span>
                                        ) : (
                                            <span className="font-mono-data text-label-sm text-outline">
                                                {article.doc_id}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                        {article.summary}
                                    </p>
                                </article>
                            );
                        })}

                        {/* Architecture schematic widget */}
                        <div className="mt-2 p-space-md rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-[20px]">sync</span>
                                </div>
                                <div>
                                    <div className="font-body-md text-body-md font-semibold text-on-surface">
                                        {tr('Auto-Sync Enabled', 'Penyegerakan Automatik Aktif')}
                                    </div>
                                    <div className="font-label-sm text-label-sm text-secondary font-mono-data">
                                        {tr('HQ Escalation Database v9.1', 'Pangkalan Data Eskalasi HQ v9.1')}
                                    </div>
                                </div>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                        </div>
                    </div>

                    {/* Right Column (60% width / 7 Cols): Full Article Preview */}
                    {activeArticle && (
                        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg shadow-sm">
                            {/* Article Header & Controls */}
                            <div className="border-b border-outline-variant pb-space-lg mb-space-lg">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md mb-space-sm">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded-full bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] font-label-sm text-label-sm font-semibold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[13px]">
                                                    verified
                                                </span>
                                                {tr('Verified Fix', 'Penyelesaian Disahkan')}
                                            </span>
                                            <span className="font-mono-data text-label-sm text-secondary">
                                                DOC-ID: {activeArticle.doc_id}
                                            </span>
                                        </div>
                                        <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                                            {activeArticle.title}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={handleOpenEdit}
                                            className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline text-on-surface font-body-md text-body-md hover:bg-surface-container-low transition-colors font-medium flex items-center gap-1.5 focus:outline-none"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                            {tr('Edit article', 'Sunting artikel')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogTaskFromFix}
                                            className="h-8 px-space-md rounded bg-primary text-on-primary font-body-md text-body-md hover:bg-primary-container transition-colors font-medium flex items-center gap-1.5 shadow-sm focus:outline-none"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                assignment_turned_in
                                            </span>
                                            {tr('Log task using this fix', 'Rekod tugasan guna penyelesaian ini')}
                                        </button>
                                    </div>
                                </div>

                                {/* Metadata Strip */}
                                <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-body-sm font-body-sm text-secondary border-t border-outline-variant/60 pt-space-sm mt-space-sm">
                                    <span className="flex items-center gap-1">
                                        <strong className="font-medium text-on-surface">
                                            {tr('Category:', 'Kategori:')}
                                        </strong>{' '}
                                        {translateCategory(activeArticle.category)}
                                    </span>
                                    <span className="text-outline-variant">·</span>
                                    <span className="flex items-center gap-1">
                                        <strong className="font-medium text-on-surface">
                                            {tr('Last updated:', 'Kemas kini terakhir:')}
                                        </strong>{' '}
                                        {activeArticle.published_date_label}
                                    </span>
                                    <span className="text-outline-variant">·</span>
                                    <span className="flex items-center gap-1">
                                        <strong className="font-medium text-on-surface">
                                            {tr('Author:', 'Penulis:')}
                                        </strong>{' '}
                                        {activeArticle.author_name}
                                    </span>
                                    <span className="text-outline-variant">·</span>
                                    <span className="flex items-center gap-1">
                                        <strong className="font-medium text-on-surface">
                                            {tr('Status:', 'Status:')}
                                        </strong>{' '}
                                        {translateStatus(activeArticle.status)}
                                    </span>
                                </div>
                            </div>

                            {/* HQ Blue Source Callout Box */}
                            <div className="rounded-lg bg-[#EFF6FF] border-2 border-primary p-space-md mb-space-lg flex items-start gap-space-sm">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                                    link
                                </span>
                                <div className="flex-1">
                                    <div className="font-body-md text-body-md text-on-surface font-medium">
                                        {tr('Source Task Verification', 'Pengesahan Tugasan Sumber')}
                                    </div>
                                    {activeArticle.source_task_id ? (
                                        <Link
                                            href={route('tasks.show', activeArticle.source_task_id)}
                                            className="font-body-md text-body-md text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                                        >
                                            {tr(
                                                `HQ response on task ${activeArticle.source_task_code} (Click to view source task)`,
                                                `Maklum balas HQ pada tugasan ${activeArticle.source_task_code} (Klik untuk lihat tugasan asal)`
                                            )}
                                            <span className="material-symbols-outlined text-[14px]">
                                                open_in_new
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="font-body-md text-body-md text-primary font-semibold inline-flex items-center gap-1 mt-0.5">
                                            {tr('HQ response on task T-000', 'Maklum balas HQ pada tugasan T-000')}
                                        </span>
                                    )}
                                </div>
                                <span className="px-2 py-0.5 rounded bg-primary/10 font-mono-data text-label-sm text-primary font-semibold uppercase">
                                    {tr('Escalation Resolved', 'Eskalasi Selesai')}
                                </span>
                            </div>

                            {/* Problem Section */}
                            <section className="mb-space-lg">
                                <div className="flex items-center gap-2 mb-space-sm">
                                    <span className="material-symbols-outlined text-error text-[18px]">
                                        error_outline
                                    </span>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                        {tr('Problem Description', 'Keterangan Masalah')}
                                    </h3>
                                </div>
                                <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant text-body-md font-body-md text-on-surface-variant leading-relaxed">
                                    {activeArticle.problem_description}
                                </div>
                            </section>

                            {/* Solution Section */}
                            <section className="mb-space-lg">
                                <div className="flex items-center justify-between mb-space-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            build_circle
                                        </span>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                            {tr('Steps to fix (numbered)', 'Langkah penyelesaian (bernombor)')}
                                        </h3>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-secondary font-mono-data">
                                        {activeArticle.steps?.length || 0}-{tr('Step Protocol', 'Langkah Protokol')}
                                    </span>
                                </div>
                                <ol className="space-y-space-sm">
                                    {(activeArticle.steps || []).map((step, index) => (
                                        <li
                                            key={index}
                                            className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant flex items-start gap-space-md hover:border-outline transition-colors"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-surface-container text-primary font-mono-data text-label-md font-semibold flex items-center justify-center shrink-0">
                                                {index + 1}
                                            </span>
                                            <div className="font-body-md text-body-md text-on-surface leading-relaxed pt-0.5">
                                                {step}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* Verification Audit Footer */}
                            <div className="pt-space-md border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm text-secondary font-body-sm text-body-sm">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                                        check_circle
                                    </span>
                                    <span>
                                        {tr('Peer-reviewed by', 'Disemak rakan sejawat oleh')}{' '}
                                        <strong>Enterprise Hardware Ops</strong>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={handleHelpful}
                                        className="text-secondary hover:text-on-surface flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                                        {tr('Helpful', 'Membantu')} ({activeArticle.helpful_count})
                                    </button>
                                    <span>·</span>
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="text-secondary hover:text-on-surface flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">share</span>
                                        {copiedLink
                                            ? tr('Link copied!', 'Pautan disalin!')
                                            : tr('Copy internal link', 'Salin pautan dalaman')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Article Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('New Knowledge Base Article', 'Artikel Pangkalan Ilmu Baharu')}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowNewModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={submitNewArticle} className="flex flex-col gap-space-md">
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Title', 'Tajuk')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newArticleForm.data.title}
                                    onChange={(e) => newArticleForm.setData('title', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Category', 'Kategori')}
                                </label>
                                <select
                                    value={newArticleForm.data.category}
                                    onChange={(e) => newArticleForm.setData('category', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                >
                                    <option value="Printer">{tr('Printer', 'Pencetak')}</option>
                                    <option value="Network">{tr('Network', 'Rangkaian')}</option>
                                    <option value="Account">{tr('Account', 'Akaun')}</option>
                                    <option value="Hardware">{tr('Hardware', 'Perkakasan')}</option>
                                    <option value="VPN">VPN</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Summary', 'Ringkasan')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newArticleForm.data.summary}
                                    onChange={(e) => newArticleForm.setData('summary', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Problem Description', 'Keterangan Masalah')}
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={newArticleForm.data.problem_description}
                                    onChange={(e) => newArticleForm.setData('problem_description', e.target.value)}
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Steps to Fix (one per line)', 'Langkah Penyelesaian (satu setiap baris)')}
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={newArticleForm.data.stepsText}
                                    onChange={(e) => newArticleForm.setData('stepsText', e.target.value)}
                                    placeholder={'Isolate unit from power\nInspect serial lot\nApply reset'}
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setShowNewModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    className="h-8 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
                                >
                                    {tr('Publish Article', 'Terbitkan Artikel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Article Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md">
                        <div className="flex items-center justify-between border-b border-outline-variant pb-space-sm">
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                                {tr('Edit Article', 'Sunting Artikel')} {activeArticle?.doc_id}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="text-secondary hover:text-on-surface"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <form onSubmit={submitEditArticle} className="flex flex-col gap-space-md">
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Title', 'Tajuk')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editArticleForm.data.title}
                                    onChange={(e) => editArticleForm.setData('title', e.target.value)}
                                    className="h-8 px-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Problem Description', 'Keterangan Masalah')}
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={editArticleForm.data.problem_description}
                                    onChange={(e) =>
                                        editArticleForm.setData('problem_description', e.target.value)
                                    }
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex flex-col gap-space-xs">
                                <label className="font-label-sm text-label-sm text-secondary">
                                    {tr('Steps to Fix (one per line)', 'Langkah Penyelesaian (satu setiap baris)')}
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={editArticleForm.data.stepsText}
                                    onChange={(e) => editArticleForm.setData('stepsText', e.target.value)}
                                    className="p-space-sm bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-outline-variant">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="h-8 px-space-md rounded bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md"
                                >
                                    {tr('Cancel', 'Batal')}
                                </button>
                                <button
                                    type="submit"
                                    className="h-8 px-space-md rounded bg-primary-container text-on-primary font-label-md text-label-md font-semibold"
                                >
                                    {tr('Save Changes', 'Simpan Perubahan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
