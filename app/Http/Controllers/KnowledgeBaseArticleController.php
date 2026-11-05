<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBaseArticle;
use App\Models\SupportTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KnowledgeBaseArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $category = $request->string('category', 'all')->trim()->toString();
        $selectedId = $request->integer('article_id');

        $query = KnowledgeBaseArticle::query()->with('sourceTask');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('problem_description', 'like', "%{$search}%")
                    ->orWhere('doc_id', 'like', "%{$search}%");
            });
        }

        if ($category !== '' && strtolower($category) !== 'all') {
            $query->whereRaw('LOWER(category) = ?', [strtolower($category)]);
        }

        $articles = $query
            ->orderBy('id')
            ->get()
            ->map(fn ($article): array => [
                'id' => $article->id,
                'doc_id' => $article->doc_id,
                'title' => $article->title,
                'category' => $article->category,
                'author_name' => $article->author_name,
                'is_verified' => $article->is_verified,
                'status' => $article->status,
                'source_task_id' => $article->source_task_id,
                'source_task_code' => $article->sourceTask?->task_code ?? 'T-000',
                'summary' => $article->summary,
                'problem_description' => $article->problem_description,
                'steps' => $article->steps ?? [],
                'helpful_count' => $article->helpful_count,
                'published_date_label' => $article->published_date_label ?? 'Oct 24, 2024',
            ])
            ->values();

        return Inertia::render('KnowledgeBase/Index', [
            'articles' => $articles,
            'selectedArticleId' => $selectedId ?: ($articles->first()['id'] ?? null),
            'filters' => [
                'search' => $search,
                'category' => strtolower($category),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'summary' => ['required', 'string', 'max:1000'],
            'problem_description' => ['required', 'string', 'max:3000'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*' => ['required', 'string', 'max:1000'],
            'source_task_id' => ['nullable', 'exists:support_tasks,id'],
        ]);

        $docId = 'KB-'.random_int(4100, 9999);
        while (KnowledgeBaseArticle::where('doc_id', $docId)->exists()) {
            $docId = 'KB-'.random_int(4100, 9999);
        }

        $article = KnowledgeBaseArticle::create([
            'doc_id' => $docId,
            'title' => $validated['title'],
            'category' => $validated['category'],
            'author_name' => $request->user()?->name ?? 'J. Doe',
            'is_verified' => true,
            'status' => 'Verified',
            'source_task_id' => $validated['source_task_id'] ?? SupportTask::where('task_code', 'T-000')->value('id'),
            'summary' => $validated['summary'],
            'problem_description' => $validated['problem_description'],
            'steps' => array_values($validated['steps']),
            'helpful_count' => 1,
            'published_date_label' => now()->format('M d, Y'),
        ]);

        return redirect()->route('knowledge-base.index', ['article_id' => $article->id])
            ->with('success', "Article {$article->doc_id} published to Knowledge Base.");
    }

    public function update(Request $request, KnowledgeBaseArticle $article): RedirectResponse
    {
        if ($request->string('action')->toString() === 'helpful') {
            $article->increment('helpful_count');

            return back()->with('success', 'Feedback recorded.');
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'summary' => ['required', 'string', 'max:1000'],
            'problem_description' => ['required', 'string', 'max:3000'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*' => ['required', 'string', 'max:1000'],
        ]);

        $article->update([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'problem_description' => $validated['problem_description'],
            'steps' => array_values($validated['steps']),
            'published_date_label' => now()->format('M d, Y'),
        ]);

        return back()->with('success', "Article {$article->doc_id} updated.");
    }
}
