import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateChange, onDayClick, eventDates = [], events = [], language = 'ru' }) => {
  const [showDayPopup, setShowDayPopup] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayStr, setSelectedDayStr] = useState('');
  const navigate = useNavigate();

  // Добавь в начало файла после импортов
  const ArrowLeftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Названия месяцев на двух языках
  const monthNames = {
    ru: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    ko: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ]
  };

  // Дни недели на двух языках
  const dayNames = {
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    ko: ['월', '화', '수', '목', '금', '토', '일']
  };

  // Тексты для попапа на двух языках
  const popupTexts = {
    ru: {
      noEvents: 'На этот день нет записей',
      addButton: '+ Добавить запись'
    },
    ko: {
      noEvents: '이 날짜에 일정이 없습니다',
      addButton: '+ 일정 추가'
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);
  const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(year, month, day);

    const dayEvents = events.filter(event => event.date === dateStr);

    setSelectedDayEvents(dayEvents);
    setSelectedDayStr(dateStr);
    setShowDayPopup(true);
  };

  const handleAddEvent = () => {
    setShowDayPopup(false);
    onDayClick(selectedDayStr);
  };

  const handleEventClick = (eventId) => {
    setShowDayPopup(false);
    navigate(`/event/${eventId}`);
  };

  const formatDisplayDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(language === 'ru' ? 'ru' : 'ko', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const days = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const hasEvent = eventDates.includes(dateStr);
    const isToday = dateStr === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    days.push(
      <div
        key={day}
        className={`calendar-day ${hasEvent ? 'has-event' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => handleDayClick(day)}
      >
        <span className="day-number">{day}</span>
        {hasEvent && <span className="event-dot"></span>}
      </div>
    );
  }

  return (
    <>
      <div className="calendar">
        <div className="calendar-header">
          <button className="calendar-nav" onClick={prevMonth}>
            <ArrowLeftIcon />
          </button>
          <h3 className="calendar-title">
            {monthNames[language][month]} {year}
          </h3>
          <button className="calendar-nav" onClick={nextMonth}>
            <ArrowRightIcon />
          </button>
        </div>
        <div className="calendar-weekdays">
          {dayNames[language].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>

      {/* Попап с событиями на день */}
      {showDayPopup && (
        <div className="day-popup-overlay" onClick={() => setShowDayPopup(false)}>
          <div className="day-popup" onClick={(e) => e.stopPropagation()}>
            <div className="day-popup-header">
              <h3>{formatDisplayDate(selectedDayStr)}</h3>
              <button className="close-btn" onClick={() => setShowDayPopup(false)}>×</button>
            </div>

            <div className="day-popup-content">
              {selectedDayEvents.length > 0 ? (
                <div className="day-events-list">
                  {selectedDayEvents.map(event => (
                    <div
                      key={event.id}
                      className="day-event-item"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <div className="day-event-time">{event.startTime}</div>
                      <div className="day-event-title">{event.title}</div>
                      {event.location && (
                        <div className="day-event-location">📍 {event.location}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-events-message">{popupTexts[language].noEvents}</p>
              )}

              <button className="add-event-from-calendar-btn" onClick={handleAddEvent}>
                {popupTexts[language].addButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;