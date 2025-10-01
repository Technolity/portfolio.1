import React, { useState, useRef, useEffect } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    alert('Message sent successfully! I\'ll get back to you soon.');
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Technolity', icon: '⚡', username: 'Technolity' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/waris-rawa-41959a216', icon: '🔗', username: 'Waris Rawa' },
    { name: 'Twitter', url: 'https://twitter.com/Technolity_', icon: '🐦', username: '@Technolity_' },
    { name: 'Instagram', url: 'https://instagram.com/technologically.traumatised', icon: '📸', username: 'Technologically.traumatised' }
  ];

  return (
    <section id="contact" className="cyber-contact section" ref={contactRef}>
      <div className="transmission-lines">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="transmission-line" style={{
            left: `${i * 12}%`,
            animationDelay: `${i * 0.3}s`
          }}></div>
        ))}
      </div>
      
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="cyber-terminal large">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="close"></span>
                  <span className="minimize"></span>
                  <span className="maximize"></span>
                </div>
                <div className="terminal-title">contact_protocol — active</div>
              </div>
              
              <div className="terminal-content">
                <div className="terminal-line">
                  <span className="prompt">system@contact:~$</span> status --connection
                </div>
                <div className="terminal-line output success">
                  ✓ ALL SYSTEMS OPERATIONAL
                </div>
                
                <div className="terminal-line">
                  <span className="prompt">system@contact:~$</span> channels --available
                </div>
                
                <div className="contact-channels">
                  <div className="contact-channel">
                    <div className="channel-icon">📧</div>
                    <div className="channel-info">
                      <div className="channel-name">EMAIL_PROTOCOL</div>
                      <div className="channel-value">warisrawa145@gmail.com</div>
                    </div>
                  </div>
                  
                  <div className="contact-channel">
                    <div className="channel-icon">📱</div>
                    <div className="channel-info">
                      <div className="channel-name">Technolity</div>
                      <div className="channel-value">+91 8493064813</div>
                    </div>
                  </div>
                  
                  <div className="contact-channel">
                    <div className="channel-icon">📍</div>
                    <div className="channel-info">
                      <div className="channel-name">COORDINATES</div>
                      <div className="channel-value">Sopore,Baramulla Kashmir,India</div>
                    </div>
                  </div>
                </div>
                
                <div className="terminal-line">
                  <span className="prompt">system@contact:~$</span> social --networks
                </div>
                
                <div className="social-grid">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url} 
                      className="social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="social-icon">{social.icon}</span>
                      <div className="social-info">
                        <span className="social-name">{social.name}</span>
                        <span className="social-username">{social.username}</span>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="terminal-line">
                  <span className="prompt">system@contact:~$</span> availability --check
                </div>
                <div className="terminal-line output"> Currently available for freelance projects and collaborations
                </div>
                <div className="terminal-line">
                  <span className="prompt">system@contact:~$</span> <span className="cursor-blink">_</span>
                </div>
              </div>
            </div>
          </div>

          <form className="cyber-contact-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div className="form-title">SEND_MESSAGE</div>
              <div className="form-status">
                {isSubmitting ? 'ENCRYPTING...' : 'READY_FOR_INPUT'}
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="input-label">YOUR_NAME</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="cyber-input"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label className="input-label">EMAIL_ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="cyber-input"
                  placeholder="warisrawa145@gmail.com"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group full-width">
                <label className="input-label">SUBJECT_LINE</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="cyber-input"
                  placeholder="Project collaboration, Job opportunity, etc."
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group full-width">
                <label className="input-label">MESSAGE_CONTENT</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="cyber-textarea"
                  placeholder="Tell me about your project, questions, or just say hello..."
                  rows="6"
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`cyber-btn submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>SENDING_MESSAGE...</span>
                </>
              ) : (
                <>
                  <span>TRANSMIT_MESSAGE</span>
                </>
              )}
            </button>

            <div className="form-footer">
              <div className="response-time">
                <span className="response-icon">⚡</span>
                <span>Usually responds within 24 hours</span>
              </div>
            </div>
          </form>
        </div>

        <div className="contact-cta">
          <div className="cta-content">
            <h3>Ready to Start Your Project?</h3>
            <p>Let's discuss how we can work together to bring your ideas to life.</p>
            <div className="cta-buttons">
              <a href="mailto:warisrawa145@gmail.com" className="cyber-btn primary">
                <span>Send Direct Email</span>
              </a>
              <a href="#projects" className="cyber-btn">
                <span>View My Work</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Contact;

