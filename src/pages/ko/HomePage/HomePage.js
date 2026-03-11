import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../../components/common/Calendar/Calendar';
import EventForm from '../../../components/events/EventForm/EventForm';
import ConflictModal from '../../../components/events/ConflictModal/ConflictModal';
import { useEventsContext } from '../../../context/EventsContext';
import './HomePage.css';

const HomePage = () => {
  const { events, addEvent } = useEventsContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [conflictEvent, setConflictEvent] = useState(null);
  const [pendingEvent, setPendingEvent] = useState(null);
  const navigate = useNavigate();

  const getNextEvent = () => {
    const now = new Date();
    return events
      .filter(event => new Date(`${event.date}T${event.startTime}`) > now)
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))[0];
  };

  const handleDayClick = (dateStr) => {
    setSelectedDay(dateStr);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('📝 Отправка формы с главной:', formData);
    const result = addEvent(formData);
    
    if (result.conflict) {
      console.log('⚠️ Конфликт на главной');
      setConflictEvent(result.event);
      setPendingEvent(formData);
    } else if (result.success) {
      console.log('✅ Событие добавлено с главной');
      setShowForm(false);
      setSelectedDay(null);
    }
  };

  const nextEvent = getNextEvent();
  const eventDates = events.map(event => event.date);

  return (
    <div className="home-page">
      <h1 className="page-title">다이어리</h1>
      
      {nextEvent && (
        <div className="next-event-section">
          <h2 className="section-title">다가오는 일정</h2>
          <div className="next-event-card" onClick={() => navigate(`/event/${nextEvent.id}`)}>
            <div className="next-event-date">
              <span className="day">{new Date(nextEvent.date).getDate()}</span>
              <span className="month">
                {new Date(nextEvent.date).toLocaleString('ko', { month: 'short' })}
              </span>
            </div>
            <div className="next-event-info">
              <h3>{nextEvent.title}</h3>
              <p className="next-event-time">
                {new Date(`${nextEvent.date}T${nextEvent.startTime}`).toLocaleString('ko', {
                  hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long'
                })}
              </p>
              {nextEvent.location && <p className="next-event-location">📍 {nextEvent.location}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="calendar-section">
        <h2 className="section-title">캘린더</h2>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onDayClick={handleDayClick}
          eventDates={eventDates}
          events={events}
          language="ko" 
        />
      </div>

      <div className="view-all-button" onClick={() => navigate('/events')}>
        모든 일정보기 <span className="arrow">→</span>
      </div>

      {showForm && (
        <EventForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedDay(null);
          }}
          selectedDate={selectedDay}
          language="ko"
        />
      )}

      {/* 모달 충돌 - 한국어 */}
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
            setSelectedDay(null);
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

export default HomePage;