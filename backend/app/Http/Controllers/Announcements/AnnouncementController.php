<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AnnouncementController extends Controller
{
    use EnforcesAnnouncementRoles;

    private const CATEGORIES = ['Academic', 'Student Affairs', 'Events', 'General Information'];

    public function index(Request $request)
    {
        $query = Announcement::query()->orderByDesc('pinned')->orderByDesc('created_at');

        if ($request->filled('category') && $request->query('category') !== 'All') {
            $query->where('category', $request->query('category'));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $this->ensureStaff($request);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::in(self::CATEGORIES)],
            'source' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'pinned' => ['sometimes', 'boolean'],
        ]);

        $validated['posted_by'] = $request->user()->user_id;

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }

    public function update(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', Rule::in(self::CATEGORIES)],
            'source' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'pinned' => ['sometimes', 'boolean'],
        ]);

        $announcement->update($validated);

        return response()->json($announcement);
    }

    public function destroy(Request $request, int $id)
    {
        $this->ensureStaff($request);

        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted successfully.']);
    }
}
