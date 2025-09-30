import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = ['FULL STACK DEVELOPER', 'AI/ML ENTHUSIAST', 'PROBLEM SOLVER', 'TECH INNOVATOR'];

  const type = useCallback(() => {
    const currentWord = words[currentWordIndex];
    
    setDisplayText(isDeleting 
      ? currentWord.substring(0, displayText.length - 1)
      : currentWord.substring(0, displayText.length + 1)
    );

    if (!isDeleting && displayText === currentWord) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }
  }, [displayText, isDeleting, currentWordIndex, words]);

  useEffect(() => {
    const timer = setTimeout(type, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [type, isDeleting]);

  // Optimized particle system - fewer particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4
  }));

  return (
    <section id="home" className="cyber-hero">
      <div className="hero-particles">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="particle" 
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🚀 WELCOME TO MY DIGITAL REALM</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">HI, I'M</span>
              <span className="title-main pixel-text">WARIS RAWA</span>
            </h1>
            
            <h2 className="hero-subtitle">
              <span className="typing-text">{displayText}</span>
              <span className="cursor">|</span>
            </h2>
            
            <p className="hero-description">
              B.Tech CSE Student passionate about Web Development, Artificial Intelligence, 
              and Machine Learning. I create innovative digital solutions that bridge 
              technology and human experience.
            </p>
            
            <div className="hero-buttons">
              <a href="#projects" className="cyber-btn primary">
                <span>View My Work</span>
              </a>
              <a href="#contact" className="cyber-btn">
                <span>Get In Touch</span>
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="profile-container">
              <div className="profile-frame">
               <div className="profile-image">
  <img 
    src="images/profile.png"  // Remove the leading slash
    alt="Waris Rawa"
    className="profile-photo"
    loading="lazy"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
  <div className="image-fallback" style={{display: 'none'}}>
    <span>Add Your Photo</span>
  </div>
                </div>
                <div className="profile-glow"></div>
                <div className="profile-grid"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll to Explore</div>
          <div className="scroll-arrow"></div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Hero);