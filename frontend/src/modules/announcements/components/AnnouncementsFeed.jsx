import { useState } from 'react';
import { Filter, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { announcementCategories, categoryStyles } from '../data';
import AnnouncementFormModal from './AnnouncementFormModal';

export default function AnnouncementsFeed({ announcements, onPost, onEdit, onDelete }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalMode, setModalMode] = useState(null); // null | 'create' | 'edit'
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? announcements
      : announcements.filter((a) => a.category === activeCategory);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setModalMode('create');
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingAnnouncement(null);
  };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (modalMode === 'edit') {
        await onEdit(editingAnnouncement.id, form);
      } else {
        await onPost(form);
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong while saving. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (announcement) => {
    if (!window.confirm(`Delete "${announcement.title}"? This cannot be undone.`)) return;
    setDeletingId(announcement.id);
    try {
      await onDelete(announcement.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong while deleting. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mr-2">
            <Filter className="w-4 h-4" />
            Category Filter:
          </span>
          {announcementCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#80172B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#80172B] hover:bg-[#651020] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Post Announcement
        </button>
      </div>

      {filtered.map((a) => (
        <div
          key={a.id}
          className={`relative bg-white rounded-xl p-5 mb-4 shadow-sm ${
            a.pinned ? 'border-2 border-amber-400' : 'border border-gray-200'
          }`}
        >
          {a.pinned && (
            <span className="absolute -top-3 right-4 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wide">
              PINNED NOTICE
            </span>
          )}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[a.category] || 'bg-gray-100 text-gray-600'}`}
            >
              {a.category}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                {a.date} <span className="mx-1">•</span> {a.source}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(a)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#80172B] hover:bg-gray-100 transition-colors"
                  aria-label="Edit announcement"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(a)}
                  disabled={deletingId === a.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Delete announcement"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{a.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{a.description}</p>
          <div className="border-t border-gray-100 pt-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-semibold text-[#80172B] hover:underline inline-flex items-center gap-1"
            >
              Read Full Circular <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          No announcements found for this category.
        </div>
      )}

      {modalMode && (
        <AnnouncementFormModal
          mode={modalMode}
          initialValues={
            modalMode === 'edit'
              ? {
                  title: editingAnnouncement.title,
                  category: editingAnnouncement.category,
                  source: editingAnnouncement.source,
                  description: editingAnnouncement.description,
                  pinned: editingAnnouncement.pinned,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onClose={closeModal}
          submitting={submitting}
        />
      )}
    </>
  );
}
