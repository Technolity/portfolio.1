import React, { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Update active section based on scroll
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`cyber-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="cyber-nav">
          <div className="nav-brand">
            <span className="pixel-name">WARIS RAWA</span>
            <span className="pixel-profession">FULL STACK DEVELOPER</span>
          </div>
          
          <ul className={`cyber-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href} 
                  className={`cyber-link ${activeSection === item.href.slice(1) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="link-text">{item.name}</span>
                  <span className="link-underline"></span>
                </a>
              </li>
            ))}
          </ul>

          <div className={`cyber-hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;