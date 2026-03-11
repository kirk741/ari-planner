import React, { createContext, useContext } from 'react';
import { useEvents } from '../hooks/useEvents';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const eventsHook = useEvents();

  const value = {
    ...eventsHook,
    allEvents: eventsHook.events,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used within EventsProvider');
  }
  return context;
};