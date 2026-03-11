import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventsContext } from '../../../context/EventsContext';
import { phoneCalendar } from '../../../services/phoneCalendar';
import EventForm from '../../../components/events/EventForm/EventForm';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allEvents, updateEvent, deleteEvent, markAsAddedToCalendar } = useEventsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState(null);

  const event = allEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="not-found">
        <h2>Запись не найдена</h2>
        <button className="btn-primary" onClick={() => navigate('/events')}>Назад</button>
      </div>
    );
  }

  const handleAddToCalendar = async () => {
    setCalendarStatus('adding');
    const result = await phoneCalendar.addToPhoneCalendar(event);
    if (result.success) {
      setCalendarStatus('success');
      markAsAddedToCalendar(event.id);
      setTimeout(() => setCalendarStatus(null), 3000);
    } else {
      setCalendarStatus('error');
      setTimeout(() => setCalendarStatus(null), 3000);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <EventForm
        initialData={event}
        onSubmit={(formData) => {
          updateEvent(id, formData);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-details-card">
        <h1 className="event-title">{event.title}</h1>

        <div className={`event-status status-${event.paymentStatus}`}>
          {event.paymentStatus === 'free' && 'Бесплатно'}
          {event.paymentStatus === 'paid' && 'Оплачено'}
          {event.paymentStatus === 'unpaid' && 'Не оплачено'}
          {event.price && ` • ${event.price}₽`}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <div className="detail-label">Дата</div>
              <div>{formatDate(event.date)}</div>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <div>
              <div className="detail-label">Время</div>
              <div>{event.startTime}</div>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⌛</span>
            <div>
              <div className="detail-label">Длительность</div>
              <div>{event.duration} мин</div>
            </div>
          </div>
        </div>

        {event.location && (
          <div className="detail-section">
            <span className="section-icon">📍</span>
            <div>
              <h3>Место</h3>
              <p>{event.location}</p>
            </div>
          </div>
        )}

        {event.organizer && (
          <div className="detail-section">
            <span className="section-icon">👤</span>
            <div>
              <h3>Ведущий</h3>
              <p>{event.organizer}</p>
            </div>
          </div>
        )}

        {event.features && (
          <div className="detail-section">
            <span className="section-icon">✨</span>
            <div>
              <h3>Особенности</h3>
              <p>{event.features}</p>
            </div>
          </div>
        )}

        {event.questions && (
          <div className="detail-section">
            <span className="section-icon">❓</span>
            <div>
              <h3>Что уточнить</h3>
              <p>{event.questions}</p>
            </div>
          </div>
        )}

        {event.notes && (
          <div className="detail-section">
            <span className="section-icon">📝</span>
            <div>
              <h3>Заметки</h3>
              <p>{event.notes}</p>
            </div>
          </div>
        )}

        <div className="event-actions">
          <button className="action-btn edit" onClick={() => setIsEditing(true)}>
            ✏️
          </button>
          <button
            className={`action-btn calendar ${calendarStatus || ''}`}
            onClick={handleAddToCalendar}
            disabled={calendarStatus === 'adding'}
          >
            {calendarStatus === 'adding' ? '🔄' :
              calendarStatus === 'success' ? '✅' :
                calendarStatus === 'error' ? '❌' :
                  event.addedToCalendar ? 'В календаре' : 'В календарь'}
          </button>
          <button className="action-btn delete" onClick={() => setShowDeleteConfirm(true)}>
            ❌
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="confirm-modal" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
            <h3>Удалить запись?</h3>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Отмена
              </button>
              <button className="btn-danger" onClick={() => {
                deleteEvent(id);
                navigate('/events');
              }}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;