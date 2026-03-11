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

  // Тексты на корейском
  const koTexts = {
    title: '모든 일정',
    addButton: '+ 새 일정',
    searchPlaceholder: '제목, 장소, 진행자 검색...',
    filterButton: '필터',
    period: '기간',
    all: '전체',
    upcoming: '예정된 일정',
    past: '지난 일정',
    payment: '결제',
    free: '무료',
    paid: '결제완료',
    unpaid: '미결제',
    loading: '로딩중...',
    noEvents: '일정이 없습니다',
    createFirst: '첫 일정 만들기'
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="page-title">{koTexts.title}</h1>
        <button className="add-event-btn" onClick={handleAddClick}>
          {koTexts.addButton}
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder={koTexts.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {koTexts.filterButton}
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>{koTexts.period}</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">{koTexts.all}</option>
                <option value="upcoming">{koTexts.upcoming}</option>
                <option value="past">{koTexts.past}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{koTexts.payment}</label>
              <select 
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
              >
                <option value="all">{koTexts.all}</option>
                <option value="free">{koTexts.free}</option>
                <option value="paid">{koTexts.paid}</option>
                <option value="unpaid">{koTexts.unpaid}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">{koTexts.loading}</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
                <EventCard event={event} language="ko" />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>{koTexts.noEvents}</p>
              <button className="create-first-btn" onClick={handleAddClick}>
                {koTexts.createFirst}
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <EventForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          language="ko"
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
          language="ko"
        />
      )}
    </div>
  );
};

export default EventsPage;