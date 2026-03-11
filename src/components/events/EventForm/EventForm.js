import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ initialData = {}, onSubmit, onCancel, selectedDate, language = 'ru' }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    duration: 60,
    location: '',
    organizer: '',
    paymentStatus: 'free',
    price: '',
    features: '',
    questions: '',
    notes: '',
    ...initialData
  });

  // Тексты на двух языках
  const texts = {
    ru: {
      title: initialData.id ? '✏️ Редактировать запись' : '✨ Новая запись',
      name: 'Название',
      date: 'Дата',
      startTime: 'Время начала',
      duration: 'Продолжительность (мин)',
      location: 'Место проведения',
      organizer: 'Кто ведет',
      payment: 'Оплата',
      free: 'Бесплатно',
      paid: 'Оплачено',
      unpaid: 'Не оплачено',
      price: 'Сумма (₽)',
      features: 'Особенности',
      featuresPlaceholder: 'Стиль, на что обратить внимание, что взять с собой',
      questions: 'Что стоит уточнить',
      questionsPlaceholder: 'Вопросы к организатору, которые нужно задать',
      notes: 'Заметки для себя',
      notesPlaceholder: 'Личные заметки, напоминания',
      cancel: 'Отмена',
      submit: initialData.id ? 'Сохранить изменения' : 'Создать запись'
    },
    ko: {
      title: initialData.id ? '✏️ 일정 수정' : '✨ 새 일정',
      name: '제목',
      date: '날짜',
      startTime: '시작 시간',
      duration: '소요시간 (분)',
      location: '장소',
      organizer: '진행자',
      payment: '결제',
      free: '무료',
      paid: '결제완료',
      unpaid: '미결제',
      price: '금액 (₩)',
      features: '특이사항',
      featuresPlaceholder: '스타일, 주의사항, 준비물',
      questions: '확인할 사항',
      questionsPlaceholder: '진행자에게 물어볼 질문',
      notes: '메모',
      notesPlaceholder: '개인 메모',
      cancel: '취소',
      submit: initialData.id ? '수정하기' : '일정 만들기'
    }
  };

  useEffect(() => {
    if (selectedDate && !initialData.id) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate, initialData.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const today = new Date().toISOString().split('T')[0];
  const t = texts[language];

  return (
    <div className="event-form-overlay" onClick={onCancel}>
      <div className="event-form-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="form-title">{t.title}</h2>

        {selectedDate && !initialData.id && (
          <div className="selected-date-info">
            📅 {new Date(selectedDate).toLocaleDateString(language === 'ru' ? 'ru' : 'ko', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.name} <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t.name}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.date} <span className="required">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label>{t.startTime} <span className="required">*</span></label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{t.duration}</label>
              <input
                type="number"
                name="duration"
                min="15"
                step="15"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t.location}</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t.location}
            />
          </div>

          <div className="form-group">
            <label>{t.organizer}</label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              placeholder={t.organizer}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t.payment}</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                <option value="free">{t.free}</option>
                <option value="paid">{t.paid}</option>
                <option value="unpaid">{t.unpaid}</option>
              </select>
            </div>

            {formData.paymentStatus !== 'free' && (
              <div className="form-group">
                <label>{t.price}</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>{t.features}</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder={t.featuresPlaceholder}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>{t.questions}</label>
            <textarea
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              placeholder={t.questionsPlaceholder}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>{t.notes}</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t.notesPlaceholder}
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              {t.cancel}
            </button>
            <button type="submit" className="btn-primary">
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;