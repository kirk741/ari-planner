import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConflictModal.css';

const ConflictModal = ({ isOpen, onClose, existingEvent, newEvent, onNavigateToEvent, onCancel, language = 'ru' }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateToEvent = () => {
    if (onNavigateToEvent) {
      onNavigateToEvent();
    } else {
      navigate(`/event/${existingEvent.id}`);
    }
    onClose();
  };

  const formatDateTime = (date, time) => {
    return new Date(`${date}T${time}`).toLocaleString(language === 'ru' ? 'ru' : 'ko', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Тексты на русском
  const ruTexts = {
    title: '⏰ Конфликт времени',
    message: 'Это время уже занято другой записью:',
    newEvent: 'Новая запись:',
    duration: 'Длительность:',
    min: 'мин',
    cancel: 'Отмена',
    navigate: 'Перейти к существующей записи'
  };

  // 텍스트 한국어
  const koTexts = {
    title: '⏰ 시간 충돌',
    message: '이 시간은 이미 다른 일정이 있습니다:',
    newEvent: '새 일정:',
    duration: '소요시간:',
    min: '분',
    cancel: '취소',
    navigate: '기존 일정보기'
  };

  const texts = language === 'ru' ? ruTexts : koTexts;

  return (
    <div className="conflict-modal-overlay" onClick={onCancel || onClose}>
      <div className="conflict-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="conflict-title">{texts.title}</h2>
        
        <p className="conflict-message">{texts.message}</p>

        <div className="existing-event-details">
          <h3>{existingEvent.title}</h3>
          <p>{formatDateTime(existingEvent.date, existingEvent.startTime)}</p>
          <p>{texts.duration} {existingEvent.duration} {texts.min}</p>
          {existingEvent.location && <p>📍 {existingEvent.location}</p>}
        </div>

        <div className="new-event-details">
          <h4>{texts.newEvent}</h4>
          <p>{newEvent.title}</p>
          <p>{formatDateTime(newEvent.date, newEvent.startTime)}</p>
        </div>

        <div className="conflict-actions">
          <button className="btn-secondary" onClick={onCancel || onClose}>
            {texts.cancel}
          </button>
          <button className="btn-primary" onClick={handleNavigateToEvent}>
            {texts.navigate}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;