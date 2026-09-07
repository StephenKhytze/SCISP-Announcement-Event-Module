import { useState, useEffect, useCallback } from 'react';
import { Megaphone, CalendarDays, UserCheck, Loader2 } from 'lucide-react';
import AnnouncementsFeed from './components/AnnouncementsFeed';
import CampusEventsDesk from './components/CampusEventsDesk';
import EventRegistrationMonitor from './components/EventRegistrationMonitor';
import api from '../../services/api';

const TABS = [
  { key: 'feed', label: 'Announcements Feed', icon: Megaphone },
  { key: 'events', label: 'Campus Events Desk', icon: CalendarDays },
  { key: 'monitor', label: 'Event Registration Monitor', icon: UserCheck },
];

const mapAnnouncement = (a) => ({
  id: a.announcement_id,
  title: a.title,
  category: a.category,
  source: a.source,
  description: a.description,
  pinned: !!a.pinned,
  date: new Date(a.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
});

export default function AnnouncementList() {
  const [activeTab, setActiveTab] = useState('feed');
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();
  // Admins/Faculty manage the announcements feed; Students manage their own event RSVPs.
  const isStaff = currentUser?.role === 'Admin' || currentUser?.role === 'Teacher';
  const isStudent = !isStaff;

  const visibleTabs = TABS.filter((tab) => tab.key !== 'monitor' || isStudent);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [announcementsRes, eventsRes, registrationsRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/announcements/events'),
        api.get('/announcements/registrations'),
      ]);
      setAnnouncements(announcementsRes.data.map(mapAnnouncement));
      setEvents(eventsRes.data);
      setRegistrations(registrationsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to load announcements data from the server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handlePostAnnouncement = async (form) => {
    const res = await api.post('/announcements', form);
    setAnnouncements((prev) => {
      const next = [mapAnnouncement(res.data), ...prev];
      return next.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    });
  };

  const handleEditAnnouncement = async (id, form) => {
    const res = await api.put(`/announcements/${id}`, form);
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? mapAnnouncement(res.data) : a)));
  };

  const handleDeleteAnnouncement = async (id) => {
    await api.delete(`/announcements/${id}`);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleRegister = async (eventId) => {
    const res = await api.post(`/announcements/events/${eventId}/register`);
    setRegistrations((prev) => [res.data, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, seatsTaken: e.seatsTaken + 1 } : e))
    );
  };

  const handleCancel = async (registrationId) => {
    const res = await api.patch(`/announcements/registrations/${registrationId}/cancel`);
    setRegistrations((prev) => prev.map((r) => (r.id === registrationId ? res.data : r)));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === res.data.eventId ? { ...e, seatsTaken: Math.max(0, e.seatsTaken - 1) } : e
      )
    );
  };

  const tabCounts = {
    feed: announcements.length,
    events: events.length,
    monitor: registrations.length,
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Announcements & Event Registration</h2>
        <p className="text-sm text-gray-500 mt-1">
          Dynamic copy-level stock availability, barcode tracking, borrower dynamic due dates & late fee calculations.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 flex">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? 'text-[#80172B] border-[#80172B]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label} ({tabCounts[tab.key]})
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading announcements & events...</span>
        </div>
      ) : (
        <>
          {activeTab === 'feed' && (
            <AnnouncementsFeed
              announcements={announcements}
              onPost={handlePostAnnouncement}
              onEdit={handleEditAnnouncement}
              onDelete={handleDeleteAnnouncement}
              canManage={isStaff}
            />
          )}

          {activeTab === 'events' && (
            <CampusEventsDesk
              events={events}
              registrations={registrations}
              onRegister={handleRegister}
              onCancel={handleCancel}
              canRegister={isStudent}
            />
          )}

          {activeTab === 'monitor' && isStudent && (
            <EventRegistrationMonitor
              registrations={registrations}
              events={events}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
}
