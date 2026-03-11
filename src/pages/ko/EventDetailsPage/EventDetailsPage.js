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
        <h2>일정을 찾을 수 없습니다</h2>
        <button className="btn-primary" onClick={() => navigate('/events')}>뒤로가기</button>
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
    return new Date(dateStr).toLocaleDateString('ko', {
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
          {event.paymentStatus === 'free' && '무료'}
          {event.paymentStatus === 'paid' && '결제완료'}
          {event.paymentStatus === 'unpaid' && '미결제'}
          {event.price && ` • ${event.price}₩`}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <div className="detail-label">날짜</div>
              <div>{formatDate(event.date)}</div>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <div>
              <div className="detail-label">시간</div>
              <div>{event.startTime}</div>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⌛</span>
            <div>
              <div className="detail-label">소요시간</div>
              <div>{event.duration} 분</div>
            </div>
          </div>
        </div>

        {event.location && (
          <div className="detail-section">
            <span className="section-icon">📍</span>
            <div>
              <h3>장소</h3>
              <p>{event.location}</p>
            </div>
          </div>
        )}

        {event.organizer && (
          <div className="detail-section">
            <span className="section-icon">👤</span>
            <div>
              <h3>진행자</h3>
              <p>{event.organizer}</p>
            </div>
          </div>
        )}

        {event.features && (
          <div className="detail-section">
            <span className="section-icon">✨</span>
            <div>
              <h3>특이사항</h3>
              <p>{event.features}</p>
            </div>
          </div>
        )}

        {event.questions && (
          <div className="detail-section">
            <span className="section-icon">❓</span>
            <div>
              <h3>확인할 사항</h3>
              <p>{event.questions}</p>
            </div>
          </div>
        )}

        {event.notes && (
          <div className="detail-section">
            <span className="section-icon">📝</span>
            <div>
              <h3>메모</h3>
              <p>{event.notes}</p>
            </div>
          </div>
        )}

        <div className="event-actions">
          <button className="action-btn edit" onClick={() => setIsEditing(true)}>
            ✏️ 수정
          </button>
          <button 
            className={`action-btn calendar ${calendarStatus || ''}`}
            onClick={handleAddToCalendar}
            disabled={calendarStatus === 'adding'}
          >
            {calendarStatus === 'adding' ? '🔄 추가중...' :
             calendarStatus === 'success' ? '✅ 추가됨!' :
             calendarStatus === 'error' ? '❌ 오류' :
             event.addedToCalendar ? '📅 캘린더에 있음' : '📅 캘린더에 추가'}
          </button>
          <button className="action-btn delete" onClick={() => setShowDeleteConfirm(true)}>
            🗑️ 삭제
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="confirm-modal" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-content" onClick={(e) => e.stopPropagation()}>
            <h3>일정을 삭제하시겠습니까?</h3>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                취소
              </button>
              <button className="btn-danger" onClick={() => {
                deleteEvent(id);
                navigate('/events');
              }}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;