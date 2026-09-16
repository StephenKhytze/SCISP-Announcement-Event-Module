import { useState } from 'react';
import { Tag, Search, CalendarDays, MapPin, User, CheckCircle2 } from 'lucide-react';
import { eventTypes, eventTypeStyles } from '../data';

export default function CampusEventsDesk({ events, registrations, onRegister, onCancel, canRegister }) {
  const [activeType, setActiveType] = useState('All');
  const [query, setQuery] = useState('');
  const [pendingEventId, setPendingEventId] = useState(null);

  const handleRegister = async (eventId) => {
    setPendingEventId(eventId);
    try {
      await onRegister(eventId);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to register for this event. Please try again.');
    } finally {
      setPendingEventId(null);
    }
  };

  const handleCancel = async (registrationId, eventId) => {
    setPendingEventId(eventId);
    try {
      await onCancel(registrationId);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to cancel this registration. Please try again.');
    } finally {
      setPendingEventId(null);
    }
  };

  const filtered = events.filter((ev) => {
    const matchesType = activeType === 'All' || ev.type === activeType;
    const matchesQuery = ev.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  const findRegistration = (eventId) =>
    registrations.find((r) => r.eventId === eventId && ['Pending Approval', 'Approved'].includes(r.status));

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mr-2">
            <Tag className="w-4 h-4" />
            Type:
          </span>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeType === type
                  ? 'bg-[#80172B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80172B]/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ev) => {
          const registration = findRegistration(ev.id);
          const seatsOpen = ev.seatsTaken;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${eventTypeStyles[ev.type] || 'bg-gray-100 text-gray-600'}`}
                >
                  {ev.type}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {seatsOpen} / {ev.seatsTotal} Seats Open
                </span>
              </div>

              <h3 className="font-bold text-gray-900 leading-snug mb-2">{ev.title}</h3>
              <p className="text-sm text-gray-500 mb-3 flex-1">{ev.description}</p>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold">{ev.date}</span>
                  <span className="text-gray-400">·</span>
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{ev.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Host: {ev.host}</span>
                </div>
              </div>

              {!canRegister ? (
                <span className="inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold bg-gray-50 text-gray-400 border border-gray-100">
                  Staff View — registration is for students
                </span>
              ) : registration ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold border ${
                      registration.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Status: {registration.status}
                  </span>
                  <button
                    onClick={() => handleCancel(registration.id, ev.id)}
                    disabled={pendingEventId === ev.id}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pendingEventId === ev.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(ev.id)}
                  disabled={pendingEventId === ev.id || seatsOpen >= ev.seatsTotal}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#80172B] hover:bg-[#651020] text-white rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CalendarDays className="w-4 h-4" />
                  {pendingEventId === ev.id
                    ? 'Registering...'
                    : seatsOpen >= ev.seatsTotal
                      ? 'Event Full'
                      : 'Register for Campus Event'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          No events match your search.
        </div>
      )}
    </>
  );
}
