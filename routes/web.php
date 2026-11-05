<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KnowledgeBaseArticleController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SupportTaskController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia\Inertia::render('Auth/Login', [
        'status' => session('status'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/tasks', [SupportTaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [SupportTaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/{task}', [SupportTaskController::class, 'show'])->name('tasks.show');
    Route::patch('/tasks/{task}', [SupportTaskController::class, 'update'])->name('tasks.update');

    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::get('/assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
    Route::patch('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');

    Route::get('/maintenance', [MaintenanceScheduleController::class, 'index'])->name('maintenance.index');
    Route::post('/maintenance', [MaintenanceScheduleController::class, 'store'])->name('maintenance.store');
    Route::patch('/maintenance/{schedule}/mark-done', [MaintenanceScheduleController::class, 'markDone'])->name('maintenance.mark-done');

    Route::get('/knowledge-base', [KnowledgeBaseArticleController::class, 'index'])->name('knowledge-base.index');
    Route::post('/knowledge-base', [KnowledgeBaseArticleController::class, 'store'])->name('knowledge-base.store');
    Route::patch('/knowledge-base/{article}', [KnowledgeBaseArticleController::class, 'update'])->name('knowledge-base.update');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
