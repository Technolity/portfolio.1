import React, { useEffect, useState } from 'react';
import '../../styles/Navbar.css';
import { profile } from '../../content/portfolioData';
import RepelText from './RepelText';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'what-i-build', 'pipeline', 'projects', 'tech-stack', 'experience', 'about', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'what-i-build', label: 'Services' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'projects', label: 'Projects' },
    { id: 'tech-stack', label: 'Stack' },
    { id: 'experience', label: 'Experience' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo clickable" onClick={() => scrollToSection('home')}>
          <img
            src="/images/profile.png"
            alt={profile.brand}
            className="navbar-logo-img"
            draggable="false"
          />
        </div>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                <RepelText>{item.label}</RepelText>
              </a>
            </li>
          ))}
          <li className="navbar-menu-resume">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              <RepelText>Resume ↓</RepelText>
            </a>
          </li>
        </ul>

        <div className="navbar-time" aria-label="Current time">
          <span className="navbar-time-value">{formatTime(time)}</span>
          <span className="navbar-time-zone">IST</span>
        </div>

        <button
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
