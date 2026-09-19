<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Announcements\Concerns\EnforcesAnnouncementRoles;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    use EnforcesAnnouncementRoles;

    public const TYPES = ['Hackathon', 'Symposium', 'Career Fair', 'Workshop', 'Seminar'];

    /** Validation rules shared by "staff creates an event" and "student requests an event". */
    public static function eventRules(): array
    {
        return [
            'type' => ['required', Rule::in(self::TYPES)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'event_time' => ['required', 'string', 'max:100'],
            'venue' => ['required', 'string', 'max:255'],
            'host' => ['required', 'string', 'max:255'],
            'seats_total' => ['required', 'integer', 'min:1', 'max:5000'],
        ];
    }

    public function index(Request $request)
    {
        $query = Event::query()->orderBy('event_date');

        if ($request->filled('type') && $request->query('type') !== 'All') {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->query('search') . '%');
        }

        return response()->json($query->get()->map(fn (Event $event) => $event->toPayload()));
    }

    public function store(Request $request)
    {
        $this->ensureStaff($request);

        $validated = $request->validate(self::eventRules());

        $event = Event::publish($validated, $request->user()->user_id);

        return response()->json($event->toPayload(), 201);
    }

    public function destroy(Request $request, int $id)
    {
        $this->ensureStaff($request);

        // Registrations and the linked announcement are removed by the database cascade.
        Event::findOrFail($id)->delete();

        return response()->json(['message' => 'Event deleted successfully.']);
    }
}
