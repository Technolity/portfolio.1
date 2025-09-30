import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/warisrawa', icon: '⚡' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/warisrawa', icon: '🔗' },
    { name: 'Twitter', url: 'https://twitter.com/warisrawa', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com/waris.rawa', icon: '📸' },
    { name: 'Email', url: 'mailto:waris.rawa@example.com', icon: '📧' }
  ];

  const techStack = [
    'React.js', 'JavaScript', 'Python', 'Java', 'C Programming',
    'HTML5', 'CSS3', 'Node.js', 'TensorFlow', 'AI/ML'
  ];

  return (
    <footer className="cyber-footer">
      <div className="footer-grid"></div>
      
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="pixel-name">WARIS RAWA</span>
                <span className="pixel-profession">FULL STACK DEVELOPER</span>
              </div>
              <p className="footer-tagline">
                Crafting digital experiences with code and creativity. 
                Bridging the gap between technology and human interaction.
              </p>
            </div>
            
            <div className="footer-cta">
              <h3>READY TO COLLABORATE?</h3>
              <p>Let's build something amazing together!</p>
              <div className="cta-buttons">
                <a href="#contact" className="cyber-btn primary">
                  <span>Start Project</span>
                </a>
                <a href="mailto:waris.rawa@example.com" className="cyber-btn">
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-navigation">
            <div className="nav-section">
              <h4>NAVIGATION</h4>
              <div className="nav-links">
                {quickLinks.map((link, index) => (
                  <a key={index} href={link.href} className="footer-link">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="nav-section">
              <h4>TECH STACK</h4>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <span key={index} className="tech-stack-item">{tech}</span>
                ))}
              </div>
            </div>
            
            <div className="nav-section">
              <h4>CONNECT</h4>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url} 
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span className="social-name">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <span>© {currentYear} WARIS RAWA. ALL RIGHTS RESERVED.</span>
          </div>
          
          <div className="footer-meta">
            <span className="meta-item">BUILT WITH REACT</span>
            <span className="meta-item">RESPONSIVE DESIGN</span>
            <span className="meta-item">OPTIMIZED PERFORMANCE</span>
          </div>
        </div>
        
        <div className="terminal-output">
          <div className="output-line">
            <span className="prompt">system@portfolio:~$</span> echo "Thank you for visiting my digital realm."
          </div>
          <div className="output-line success"> Connection established. Let's build the future together.
          </div>
          <div className="output-line">
            <span className="prompt">system@portfolio:~$</span> <span className="cursor-blink">_</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;