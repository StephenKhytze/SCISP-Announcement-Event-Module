<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventRegistrationController extends Controller
{
    private function ensureStudent(Request $request): void
    {
        if ($request->user()->role !== 'student') {
            abort(403, 'Only students may register for or cancel campus events.');
        }
    }

    public function index(Request $request)
    {
        $registrations = EventRegistration::query()
            ->where('user_id', $request->user()->user_id)
            ->with('event')
            ->orderByDesc('registered_on')
            ->get()
            ->map(function (EventRegistration $registration) {
                return [
                    'id' => $registration->registration_id,
                    'eventId' => $registration->event_id,
                    'ticketCode' => $registration->ticket_code,
                    'status' => $registration->status,
                    'registeredOn' => $registration->registered_on->format('Y-m-d H:i'),
                ];
            });

        return response()->json($registrations);
    }

    public function register(Request $request, int $eventId)
    {
        $this->ensureStudent($request);

        $event = Event::findOrFail($eventId);

        $alreadyRegistered = EventRegistration::query()
            ->where('event_id', $eventId)
            ->where('user_id', $request->user()->user_id)
            ->where('status', '!=', 'Cancelled')
            ->exists();

        if ($alreadyRegistered) {
            return response()->json(['message' => 'You are already registered for this event.'], 422);
        }

        if ($event->seats_taken >= $event->seats_total) {
            return response()->json(['message' => 'This event is already full.'], 422);
        }

        $prefix = strtoupper(Str::substr(preg_replace('/[^A-Za-z]/', '', $event->type), 0, 3));

        $registration = EventRegistration::create([
            'event_id' => $eventId,
            'user_id' => $request->user()->user_id,
            'ticket_code' => sprintf('TCK-%s-%04d', $prefix, random_int(1000, 9999)),
            'status' => 'Pending Approval',
            'registered_on' => now(),
        ]);

        return response()->json([
            'id' => $registration->registration_id,
            'eventId' => $registration->event_id,
            'ticketCode' => $registration->ticket_code,
            'status' => $registration->status,
            'registeredOn' => $registration->registered_on->format('Y-m-d H:i'),
        ], 201);
    }

    public function cancel(Request $request, int $id)
    {
        $this->ensureStudent($request);

        $registration = EventRegistration::query()
            ->where('registration_id', $id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $registration->update(['status' => 'Cancelled']);

        return response()->json([
            'id' => $registration->registration_id,
            'eventId' => $registration->event_id,
            'ticketCode' => $registration->ticket_code,
            'status' => $registration->status,
            'registeredOn' => $registration->registered_on->format('Y-m-d H:i'),
        ]);
    }
}
