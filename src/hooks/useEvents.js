import { useState, useEffect } from 'react';

const STORAGE_KEY = 'events';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      const loadedEvents = stored ? JSON.parse(stored) : [];
      setEvents(loadedEvents);
      console.log('📥 Загружено событий:', loadedEvents.length);
    } catch (err) {
      console.error('❌ Ошибка загрузки:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (newEvents) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // 🔥 ИСПРАВЛЕННАЯ ПРОВЕРКА КОНФЛИКТОВ
  const checkConflict = (newEvent, excludeId = null) => {
    console.log('🔍 Проверка конфликта для:', newEvent);
    
    if (!newEvent.date || !newEvent.startTime) {
      console.log('❌ Нет даты или времени');
      return null;
    }

    const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const newEnd = new Date(newStart.getTime() + (newEvent.duration || 60) * 60000);

    console.log('🕐 Новое событие:', {
      start: newStart.toLocaleString(),
      end: newEnd.toLocaleString()
    });

    const conflict = events.find(event => {
      // Пропускаем текущее событие при редактировании
      if (excludeId && event.id === excludeId) {
        return false;
      }

      if (!event.date || !event.startTime) return false;

      const eventStart = new Date(`${event.date}T${event.startTime}`);
      const eventEnd = new Date(eventStart.getTime() + (event.duration || 60) * 60000);

      const isConflict = (newStart < eventEnd && newEnd > eventStart);
      
      if (isConflict) {
        console.log('⚠️ Найден конфликт с:', {
          id: event.id,
          title: event.title,
          start: eventStart.toLocaleString(),
          end: eventEnd.toLocaleString()
        });
      }

      return isConflict;
    });

    return conflict || null;
  };

  const addEvent = (eventData) => {
    try {
      setLoading(true);
      console.log('📝 Добавление события:', eventData);
      
      // Проверяем конфликт
      const conflict = checkConflict(eventData);
      if (conflict) {
        console.log('⛔ Конфликт обнаружен!');
        return { conflict: true, event: conflict };
      }

      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        addedToCalendar: false
      };

      const updatedEvents = [...events, newEvent];
      saveToStorage(updatedEvents);
      setEvents(updatedEvents);
      console.log('✅ Событие добавлено:', newEvent);
      
      return { success: true, event: newEvent };
    } catch (err) {
      console.error('❌ Ошибка добавления:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = (id, eventData) => {
    try {
      setLoading(true);
      console.log('📝 Обновление события:', id, eventData);
      
      // Проверяем конфликт, исключая текущее событие
      const conflict = checkConflict(eventData, id);
      if (conflict) {
        console.log('⛔ Конфликт при обновлении!');
        return { conflict: true, event: conflict };
      }

      const updatedEvents = events.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      );
      
      saveToStorage(updatedEvents);
      setEvents(updatedEvents);
      console.log('✅ Событие обновлено');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Ошибка обновления:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = (id) => {
    try {
      setLoading(true);
      const updatedEvents = events.filter(event => event.id !== id);
      saveToStorage(updatedEvents);
      setEvents(updatedEvents);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const markAsAddedToCalendar = (id) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, addedToCalendar: true } : event
    );
    saveToStorage(updatedEvents);
    setEvents(updatedEvents);
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    markAsAddedToCalendar,
    refreshEvents: loadEvents
  };
};