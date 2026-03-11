import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventsContext } from '../../../context/EventsContext';
import EventCard from '../../../components/events/EventCard/EventCard';
import EventForm from '../../../components/events/EventForm/EventForm';
import ConflictModal from '../../../components/events/ConflictModal/ConflictModal';
import './EventsPage.css';

const EventsPage = () => {
  const { events, loading, addEvent } = useEventsContext();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    paymentStatus: 'all'
  });
  const [conflictEvent, setConflictEvent] = useState(null);
  const [pendingEvent, setPendingEvent] = useState(null);
  const navigate = useNavigate();

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('📝 Отправка формы:', formData);
    const result = addEvent(formData);
    
    if (result.conflict) {
      console.log('⚠️ Показываем модалку конфликта');
      setConflictEvent(result.event);
      setPendingEvent(formData);
    } else if (result.success) {
      console.log('✅ Событие добавлено, закрываем форму');
      setShowForm(false);
    }
  };

  // Фильтрация событий
  const filteredEvents = events.filter(event => {
    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(query) ||
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.organizer && event.organizer.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Фильтр по дате
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const eventDate = new Date(event.date);
      
      if (filters.dateRange === 'upcoming' && eventDate < today) return false;
      if (filters.dateRange === 'past' && eventDate >= today) return false;
    }

    // Фильтр по оплате
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      if (event.paymentStatus !== filters.paymentStatus) return false;
    }

    return true;
  }).sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="page-title">Все записи</h1>
        <button className="add-event-btn" onClick={handleAddClick}>
          + Новая
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск по названию, месту, ведущему..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            Фильтр
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Период</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">Все</option>
                <option value="upcoming">Предстоящие</option>
                <option value="past">Прошедшие</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Оплата</label>
              <select 
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
              >
                <option value="all">Все</option>
                <option value="free">Бесплатно</option>
                <option value="paid">Оплачено</option>
                <option value="unpaid">Не оплачено</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Загрузка...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
                <EventCard event={event} language="ru" />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>Нет записей</p>
              <button className="create-first-btn" onClick={handleAddClick}>
                Создать
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <EventForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          language="ru"
        />
      )}

      {conflictEvent && pendingEvent && (
        <ConflictModal
          isOpen={true}
          onClose={() => {
            setConflictEvent(null);
            setPendingEvent(null);
          }}
          existingEvent={conflictEvent}
          newEvent={pendingEvent}
          onNavigateToEvent={() => {
            navigate(`/event/${conflictEvent.id}`);
            setConflictEvent(null);
            setPendingEvent(null);
            setShowForm(false);
          }}
          onCancel={() => {
            setConflictEvent(null);
            setPendingEvent(null);
          }}
          language="ru"
        />
      )}
    </div>
  );
};

export default EventsPage;