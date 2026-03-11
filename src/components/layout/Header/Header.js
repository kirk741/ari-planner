import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// SVG иконки стрелок
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Header = ({ language = 'ru', onLanguageToggle }) => {
  const location = useLocation();
  const isNotHome = location.pathname !== '/';

  // Тексты для кнопки "На главную"
  const homeButtonText = {
    ru: 'На главную',
    ko: '홈으로'
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {isNotHome && (
            <Link to="/" className="home-btn">
              <ArrowLeftIcon />
              <span className="home-text">{homeButtonText[language]}</span>
            </Link>
          )}
        </div>

        {/* Логотип */}
        <Link to="/" className="logo">
          <span className="logo-text">Ari Planer</span>
        </Link>
        
        <div className="header-right">
          {/* Кнопка переключения языка внутри хедера */}
          <button onClick={onLanguageToggle} className="lang-btn">
            {language === 'ru' ? '🇰🇷 한국어' : '🇷🇺 Русский'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;