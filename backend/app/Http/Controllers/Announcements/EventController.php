<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()->orderBy('event_date');

        if ($request->filled('type') && $request->query('type') !== 'All') {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->query('search') . '%');
        }

        $events = $query->get()->map(function (Event $event) {
            return [
                'id' => $event->event_id,
                'type' => $event->type,
                'title' => $event->title,
                'description' => $event->description,
                'date' => $event->event_date->format('Y-m-d'),
                'time' => $event->event_time,
                'venue' => $event->venue,
                'host' => $event->host,
                'seatsTaken' => $event->seats_taken,
                'seatsTotal' => $event->seats_total,
            ];
        });

        return response()->json($events);
    }
}
