import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import Header from './components/layout/Header/Header';
import Navigation from './components/layout/Navigation/Navigation';

// Импорт русских страниц
import HomePageRu from './pages/ru/HomePage/HomePage';
import EventsPageRu from './pages/ru/EventsPage/EventsPage';
import EventDetailsPageRu from './pages/ru/EventDetailsPage/EventDetailsPage';

// Импорт корейских страниц
import HomePageKo from './pages/ko/HomePage/HomePage';
import EventsPageKo from './pages/ko/EventsPage/EventsPage';
import EventDetailsPageKo from './pages/ko/EventDetailsPage/EventDetailsPage';

import './App.css';

function App() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    return savedLanguage || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    console.log('🌐 Язык сохранен:', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'ko' : 'ru');
  };

  return (
    <BrowserRouter>
      <EventsProvider>
        <div className="app">
          <Header language={language} onLanguageToggle={toggleLanguage} />
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  language === 'ru' 
                    ? <HomePageRu /> 
                    : <HomePageKo />
                } 
              />
              <Route 
                path="/events" 
                element={
                  language === 'ru' 
                    ? <EventsPageRu /> 
                    : <EventsPageKo />
                } 
              />
              <Route 
                path="/event/:id" 
                element={
                  language === 'ru' 
                    ? <EventDetailsPageRu /> 
                    : <EventDetailsPageKo />
                } 
              />
            </Routes>
          </main>
          <Navigation />
        </div>
      </EventsProvider>
    </BrowserRouter>
  );
}

export default App;