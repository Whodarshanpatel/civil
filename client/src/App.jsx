
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Linkedin, ArrowRight, 
  Construction, Ruler, DraftingCompass, Building2, HardHat, Lightbulb, Globe, CheckCircle2, Play, Quote
} from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const translations = {
  en: {
    nav_about: 'About',
    nav_skills: 'Skills',
    nav_services: 'Services',
    nav_exp: 'Experience',
    nav_testimonials: 'Testimonials',
    nav_contact: 'Contact',
    nav_hire: 'Hire Me',
    hero_btn1: 'Get In Touch',
    hero_btn2: 'View Projects',
    section_about: 'About Me',
    section_skills: 'My Skills',
    section_services: 'I Can Help With',
    section_exp: 'Career Journey',
    section_testimonials: 'Client Reviews',
    section_contact: 'Connect',
    form_send: 'Send Message',
    form_sending: 'Sending...',
    form_success: 'Message Sent Successfully!',
    about_h2: 'Crafting the future of structural engineering',
    about_bio: 'Experienced Civil Engineer with a strong background in structural design, project management, and site supervision. I have a passion for creating sustainable and efficient structures that stand the test of time.',
    skill_title: 'Technical',
    skill_em: 'Proficiency',
    serv_title: 'My',
    serv_em: 'Services',
    exp_title: 'Work',
    exp_em: 'History',
    test_title: 'What',
    test_em: 'Clients Say',
    cont_title: "Let's",
    cont_em: 'Build Together',
    modal_close: 'Close Video',
    modal_transcript: 'Video Transcript'
  },
  hi: {
    nav_about: 'परिचय',
    nav_skills: 'कौशल',
    nav_services: 'सेवाएं',
    nav_exp: 'अनुभव',
    nav_testimonials: 'प्रशंसापत्र',
    nav_contact: 'संपर्क',
    nav_hire: 'हायर मी',
    hero_btn1: 'संपर्क करें',
    hero_btn2: 'प्रोजेक्ट्स देखें',
    section_about: 'मेरे बारे में',
    section_skills: 'मेरे कौशल',
    section_services: 'सेवाएं',
    section_exp: 'करियर',
    section_testimonials: 'क्लाइंट रिव्यू',
    section_contact: 'जुड़ें',
    form_send: 'मैसेज भेजें',
    form_sending: 'भेજ रहा है...',
    form_success: 'मैसेज सफलतापूर्वक भेजा गया!',
    about_h2: 'संरचनात्मक इंजीनियरिंग के भविष्य का निर्माण',
    about_bio: 'संरचनात्मक डिजाइन, परियोजना प्रबंधन और साइट पर्यवेक्षण में मजबूत पृष्ठभूमि वाला अनुभवी सिविल इंजीनियर। मेरे पास टिकाऊ और कुशल संरचनाएं बनाने का जुनून है जो समय की कसौटी पर खरी उतरती हैं।',
    skill_title: 'तकनीकी',
    skill_em: 'दक्षता',
    serv_title: 'मेरी',
    serv_em: 'सेवाएं',
    exp_title: 'कार्य',
    exp_em: 'इतिहास',
    test_title: 'क्लाइंट',
    test_em: 'क्या कहते हैं',
    cont_title: 'आइए',
    cont_em: 'साथ मिलकर बनाएं',
    modal_close: 'वीडियो बंद करें',
    modal_transcript: 'वीडियो ट्रांसक्रिप्ट'
  },
  gu: {
    nav_about: 'પરિચય',
    nav_skills: 'કૌશલ્ય',
    nav_services: 'સેવાઓ',
    nav_exp: 'અનુભવ',
    nav_testimonials: 'પ્રશંસાપત્ર',
    nav_contact: 'સંદેશ',
    nav_hire: 'કામ આપો',
    hero_btn1: 'સંદેશ મોકલો',
    hero_btn2: 'પ્રોજેક્ટ્સ',
    section_about: 'મારા વિશે',
    section_skills: 'કૌશલ્ય',
    section_services: 'સેવાઓ',
    section_exp: 'અનુભવ',
    section_testimonials: 'ગ્રાહકોનો અભિપ્રાય',
    section_contact: 'જોડાઓ',
    form_send: 'સંદેશ મોકલો',
    form_sending: 'મોકલી રહ્યું છે...',
    form_success: 'સંદેશ સફળતાપૂર્વક મોકલવામાં આવ્યો!',
    about_h2: 'સ્ટ્રક્ચરલ એન્જિનિયરિંગના ભવિષ્યનું નિર્માણ',
    about_bio: 'સ્ટ્રક્ચરલ ડિઝાઇન, પ્રોજેક્ટ મેનેજમેન્ટ અને સાઇટ સુપરવિઝનમાં મજબૂત પૃષ્ઠભૂમિ સાથે અનુભવી સિવિલ એન્જિનિયર. મને ટકાઉ અને કાર્યક્ષમ સ્ટ્રક્ચર્સ બનાવવાનો શોખ છે જે સમયની કસોટી પર ટકી રહે.',
    skill_title: 'તકનીકી',
    skill_em: 'કુશળતા',
    serv_title: 'મારી',
    serv_em: 'સેવાઓ',
    exp_title: 'કાર્ય',
    exp_em: 'ઇતિહાસ',
    test_title: 'ગ્રાહકો',
    test_em: 'શું કહે છે',
    cont_title: 'ચાલો',
    cont_em: 'સાથે મળીને બનાવીએ',
    modal_close: 'વિડિઓ બંધ કરો',
    modal_transcript: 'વિડિઓ ટ્રાન્સક્રિપ્ટ'
  }
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('en');
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const t = (key) => translations[lang][key] || key;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/portfolio`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data, using fallback');
        setData({
          hero: {
            tag: 'Civil Engineer & Structural Designer',
            h1: 'ENGINEERING',
            h2: 'EXCELLENCE',
            sub: 'Creative & Reliable Civil Engineering Solutions — From Blueprint to Built Reality.',
            stats: [
              { label: 'Years Exp.', num: '8', span: '+' },
              { label: 'Projects Done', num: '42', span: '+' },
              { label: 'Happy Clients', num: '15', span: '+' }
            ]
          },
          about: {
            bio: 'Experienced Civil Engineer with a strong background in structural design, project management, and site supervision. I have a passion for creating sustainable and efficient structures that stand the test of time.',
            info: [
              { label: 'Name', value: 'Sanket Valand' },
              { label: 'Email', value: 'sanket@example.com' },
              { label: 'Location', value: 'Gujarat, India' },
              { label: 'Availability', value: 'Full-time / Freelance' }
            ]
          },
          skills: [
            { name: 'AutoCAD', icon: '🏗️', level: 90 },
            { name: 'Staad Pro', icon: '📐', level: 85 },
            { name: 'Revit', icon: '🏢', level: 80 },
            { name: 'Project Mgmt', icon: '📅', level: 95 }
          ],
          services: [
            { title: 'Structural Design', desc: 'Planning and designing structural frameworks for buildings.', icon: '🏗️' },
            { title: 'Site Supervision', desc: 'Managing on-site construction activities and quality control.', icon: '👷' },
            { title: 'Consultancy', desc: 'Expert advice on civil engineering projects.', icon: '💡' }
          ],
          experience: [
            { date: '2018 - Present', role: 'Senior Civil Engineer', company: 'BuildSmart Solutions', desc: 'Leading structural design teams and overseeing major commercial projects.' },
            { date: '2015 - 2018', role: 'Junior Civil Engineer', company: 'IndoDesign Builders', desc: 'Assisted in site surveys and preliminary structural analysis.' }
          ],
          education: [
            { year: '2011 - 2015', degree: 'B.Tech in Civil Engineering', institute: 'IIT Bombay', grade: '9.2 CGPA' }
          ],
          contact: {
            email: 'sanket.valand@engg.com',
            phone: '+91 9876543210',
            location: 'Ahmedabad, Gujarat',
            linkedin: 'linkedin.com/in/sanketvaland'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });
    try {
      await axios.post(`${API_URL}/contact`, formState);
      setStatus({ loading: false, success: true, error: null });
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus({ ...status, success: false }), 4000);
    } catch (err) {
      console.error('Submission failed');
      setStatus({ loading: false, success: false, error: 'Failed to send message' });
    }
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const videoTestimonials = [
    { 
      name: 'Rajesh Mehta', 
      role: 'Real Estate Developer', 
      img: '/client1.png', 
      review: 'Sanket is a brilliant engineer. His structural analysis saved us months of rework.',
      transcript: 'I first met Sanket during our SkyLink Tower project. We were facing a complex cantilever challenge that other firms couldn\'t resolve without massive cost overruns. Sanket stepped in, performed a detailed dynamic analysis, and optimized the steel reinforcement in a way that actually IMPROVED the aesthetics while saving us over 15% on materials. He is my go-to engineer now.'
    },
    { 
      name: 'Ananya Sharma', 
      role: 'Senior Architect', 
      img: '/client2.png', 
      review: 'I loved working with Sanket. He understands architectural intent perfectly.',
      transcript: 'As an architect, it is rare to find a civil engineer who doesn\'t just say "no" to my designs. Sanket works WITH me. When we designed the brutalist concrete museum in Ahmedabad, he found innovative ways to hide the load-bearing columns within the walls. He understands the art of engineering just as much as the math.'
    },
    { 
      name: 'Kushal Patel', 
      role: 'Villa Owner', 
      img: '/client3.png', 
      review: 'Our dream home became a reality thanks to Sanket. Timely and professional.',
      transcript: 'Building a private villa can be stressful, but Sanket made the structural phase completely worry-free. He was on-site every week, checking the quality of concrete and the placement of rebar. He treated our home like his own. The structure is rock solid, and his attention to seismic safety gave my family immense peace of mind.'
    }
  ];

  if (loading) return <div className="loading">Loading Portfolio...</div>;

  return (
    <div className="portfolio">
      {/* ── NAVBAR ── */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <div className="nav-logo">Sanket<span>.</span>Valand</div>
        
        <div className="nav-controls">
           <div className="lang-switcher">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>HI</button>
              <button className={lang === 'gu' ? 'active' : ''} onClick={() => setLang('gu')}>GU</button>
           </div>
           <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
           </div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>{t('nav_about')}</a></li>
          <li><a href="#skills" onClick={() => setMenuOpen(false)}>{t('nav_skills')}</a></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>{t('nav_services')}</a></li>
          <li><a href="#experience" onClick={() => setMenuOpen(false)}>{t('nav_exp')}</a></li>
          <li><a href="#testimonials" onClick={() => setMenuOpen(false)}>{t('nav_testimonials')}</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>{t('nav_contact')}</a></li>
          <a href="#contact" className="nav-cta">{t('nav_hire')}</a>
        </ul>
      </nav>

      {/* ── TESTIMONIAL MODAL ── */}
      <AnimatePresence>
        {selectedTestimonial && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="video-modal-overlay"
             onClick={() => setSelectedTestimonial(null)}
           >
              <motion.div 
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="video-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                 <div className="modal-header">
                    <div className="modal-client-info">
                       <img src={selectedTestimonial.img} alt={selectedTestimonial.name} />
                       <div>
                          <h4>{selectedTestimonial.name}</h4>
                          <p>{selectedTestimonial.role}</p>
                       </div>
                    </div>
                    <button className="close-modal" onClick={() => setSelectedTestimonial(null)}><X /></button>
                 </div>
                 <div className="modal-body">
                    <div className="video-placeholder">
                       <img src={selectedTestimonial.img} alt="Video Frame" />
                       <div className="playing-indicator">
                          <span></span><span></span><span></span><span></span>
                       </div>
                    </div>
                    <div className="transcript-box">
                       <h5><Quote size={20} fill="var(--yellow)" /> {t('modal_transcript')}</h5>
                       <p>{selectedTestimonial.transcript}</p>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <header className="hero" id="home">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <div className="hero-tag">{data.hero.tag}</div>
            <h1 className="hero-heading">
              <span className="line-highlight">{data.hero.h1}</span><br/>
              <span className="line-outline">{data.hero.h2}</span>
            </h1>
            <p className="hero-sub">{data.hero.sub}</p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary">{t('hero_btn1')}</a>
              <a href="#experience" className="btn-outline">{t('hero_btn2')}</a>
            </div>
            <div className="hero-stats">
              {data.hero.stats.map((stat, i) => (
                <div key={i} className="stat">
                  <span className="stat-num">{stat.num}<span>{stat.span}</span></span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image-side"
          >
            <div className="image-wrap">
              <div className="img-bg"></div>
              <div className="img-frame">
                 <img src="/engineer.png" alt="Engineer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="badge b1">🏗️ Quality First</div>
              <div className="badge b2">📐 Precise Design</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="section-label">{t('section_about')}</div>
        <div className="about-grid">
          <div className="about-text">
            <h2>{t('about_h2')}<span className="dot">.</span></h2>
            <p className="bio">{t('about_bio')}</p>
            <div className="info-grid">
              {data.about.info.map((info, i) => (
                <div key={i} className="info-item">
                  <span className="info-label">{info.label}</span>
                  <span className="info-value">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="skills-section" id="skills">
        <div className="section-label">{t('section_skills')}</div>
        <h2 className="section-title">{t('skill_title')} <em>{t('skill_em')}</em></h2>
        <div className="skills-grid">
          {data.skills.map((skill, i) => (
             <motion.div 
               whileHover={{ y: -10 }}
               key={i} 
               className="skill-card"
             >
               <span className="skill-icon">{skill.icon}</span>
               <span className="skill-name">{skill.name}</span>
               <div className="skill-level">
                 <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: `${skill.level}%` }}
                   transition={{ duration: 1.5 }}
                   className="skill-fill"
                 ></motion.div>
               </div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services" id="services">
        <div className="section-label">{t('section_services')}</div>
        <h2 className="section-title">{t('serv_title')} <em>{t('serv_em')}</em></h2>
        <div className="services-grid">
          {data.services.map((service, i) => (
            <div key={i} className="service-card">
              <div className="service-icon-bg">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="experience" id="experience">
        <div className="section-label">{t('section_exp')}</div>
        <h2 className="section-title">{t('exp_title')} <em>{t('exp_em')}</em></h2>
        <div className="timeline">
          {data.experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <span className="timeline-date">{exp.date}</span>
                <h3 className="timeline-role">{exp.role}</h3>
                <h4 className="timeline-company">{exp.company}</h4>
                <p className="timeline-desc">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials" id="testimonials">
        <div className="section-label">{t('section_testimonials')}</div>
        <h2 className="section-title">{t('test_title')} <em>{t('test_em')}</em></h2>
        <div className="testimonials-grid">
          {videoTestimonials.map((test, i) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={i} 
              className="testimonial-card"
              onClick={() => setSelectedTestimonial(test)}
            >
              <div className="testimonial-video">
                 <img src={test.img} alt={test.name} />
                 <div className="play-overlay"><Play size={40} fill="var(--yellow)" /></div>
              </div>
              <div className="testimonial-content">
                 <p className="review">"{test.review}"</p>
                 <h4 className="client-name">{test.name}</h4>
                 <p className="client-role">{test.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact" id="contact">
        <div className="section-label">{t('section_contact')}</div>
        <h2 className="section-title">{t('cont_title')} <em>{t('cont_em')}</em></h2>
        <div className="contact-wrap">
          <div className="contact-info">
             <div className="contact-item">
               <div className="icon-box"><Mail /></div>
               <div>
                  <div className="label">Mail</div>
                  <div className="val">{data.contact.email}</div>
               </div>
             </div>
             <div className="contact-item">
                <div className="icon-box"><Phone /></div>
                <div>
                  <div className="label">Call</div>
                  <div className="val">{data.contact.phone}</div>
               </div>
             </div>
             <div className="contact-item">
                <div className="icon-box"><MapPin /></div>
                <div>
                  <div className="label">Office</div>
                  <div className="val">{data.contact.location}</div>
               </div>
             </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
             <h3 className="form-title">Send a message</h3>
             <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Your Name" required />
             <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="Email Address" required />
             <textarea name="message" value={formState.message} onChange={handleInputChange} placeholder="Tell me about your project" rows="5" required></textarea>
             
             <button type="submit" className="btn-primary" disabled={status.loading}>
               {status.loading ? t('form_sending') : status.success ? t('form_success') : t('form_send')} 
               {status.success ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
             </button>
             {status.error && <p className="error-msg">{status.error}</p>}
          </form>
        </div>
      </section>

      <footer className="footer">
         <p>© {new Date().getFullYear()} Sanket Valand. All Rights Reserved.</p>
         <p>Created by <span>Civil Engineers</span> for India.</p>
      </footer>
    </div>
  );
};

export default App;
