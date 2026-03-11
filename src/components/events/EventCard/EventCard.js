import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ event, language = 'ru' }) => {
  // Тексты для статусов оплаты
  const paymentTexts = {
    ru: {
      free: 'Бесплатно',
      paid: 'Оплачено',
      unpaid: 'Не оплачено'
    },
    ko: {
      free: '무료',
      paid: '결제완료',
      unpaid: '미결제'
    }
  };

  // Текст для минут
  const minutesText = {
    ru: 'мин',
    ko: '분'
  };

  const getPaymentBadge = () => {
    const text = paymentTexts[language][event.paymentStatus] || event.paymentStatus;
    
    switch (event.paymentStatus) {
      case 'free': 
        return <span className="badge free">{text}</span>;
      case 'paid': 
        return <span className="badge paid">{text}</span>;
      case 'unpaid': 
        return <span className="badge unpaid">{text}</span>;
      default: 
        return null;
    }
  };

  const formatTime = (time) => {
    return time.substring(0, 5);
  };

  return (
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-card-header">
          <h3 className="event-title">{event.title}</h3>
          {getPaymentBadge()}
        </div>
        
        <div className="event-datetime">
          <span className="date">{event.date}</span>
          <span className="time">{formatTime(event.startTime)}</span>
          <span className="duration">{event.duration} {minutesText[language]}</span>
        </div>

        {event.location && (
          <div className="event-location">📍 {event.location}</div>
        )}
      </div>
    </Link>
  );
};

export default EventCard;