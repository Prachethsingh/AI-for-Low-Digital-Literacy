import React, { useState } from 'react'
import './App.css'
import { Mic, Globe, Shield, Smartphone, Zap, CheckCircle } from 'lucide-react'

function App() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Namaste! I am your Kisan Sahayak.",
      subtitle: "How can I help you today?",
      options: ["Apply for PM-Kisan", "Check Crop Insurance", "Market Prices"]
    },
    {
      title: "Apply for PM-Kisan",
      subtitle: "Do you have your Aadhaar Card with you?",
      options: ["Yes, I have it 👍", "No, I don't 👎"]
    },
    {
      title: "Great! Please show your Aadhaar Card.",
      subtitle: "The camera is now scanning...",
      isCamera: true,
      options: ["Captured!"]
    },
    {
      title: "Verification Successful!",
      subtitle: "Would you like to submit the application now?",
      options: ["Submit Now ✅", "Go Back"]
    }
  ]

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else setStep(0)
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <Zap size={28} />
          KisanSahayak AI
        </div>
        <div className="nav-links">
          <Globe size={20} style={{marginRight: '1rem'}} />
          English / ಕನ್ನಡ
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Empowering 100 Million Farmers with AI.</h1>
          <p>
            An AI-first interface designed for low-digital-literacy users. 
            Zero typing. Zero reading complexity. Just voice and visuals.
          </p>
          <div className="cta-group">
            <button className="btn btn-primary" onClick={() => window.scrollTo(0, 1000)}>Watch Demo</button>
            <button className="btn btn-outline">Github Repo</button>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/hero.png" alt="AI Farmer Assistant" className="hero-image" />
        </div>
      </header>

      <section className="mockup-section">
        <h2>Interactive Prototype</h2>
        <p style={{color: '#888', marginTop: '1rem'}}>Experience the seamless voice-guided flow below</p>
        
        <div className="mockup-grid">
          <div className="phone-mockup">
            <div className="app-screen">
              <div className="robot-head">🤖</div>
              <h3>{steps[step].title}</h3>
              <p style={{color: '#aaa', margin: '0.5rem 0'}}>{steps[step].subtitle}</p>
              
              <div className="waves">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>

              <div style={{marginTop: 'auto'}}>
                {steps[step].options.map((opt, i) => (
                  <div key={i} className="option-btn" onClick={nextStep}>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="demo-notes" style={{textAlign: 'left', maxWidth: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h3 style={{color: 'var(--secondary)', marginBottom: '1rem'}}>Why this wins:</h3>
            <ul style={{listStyle: 'none'}}>
              <li style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <CheckCircle color="var(--secondary)" />
                <span><b>Voice-First:</b> Minimizes cognitive load for semi-literate users.</span>
              </li>
              <li style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <CheckCircle color="var(--secondary)" />
                <span><b>Bilingual Support:</b> Native language support (Kannada/English).</span>
              </li>
              <li style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <CheckCircle color="var(--secondary)" />
                <span><b>Computer Vision:</b> Instant document scanning replaces complex forms.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="icon-box"><Mic /></div>
          <h3>Voice Intelligence</h3>
          <p>Advanced NLU specifically trained for agricultural dialects and intents.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><Smartphone /></div>
          <h3>Offline-First</h3>
          <p>Optimized for low-bandwidth rural areas with edge processing.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><Shield /></div>
          <h3>Secure & Direct</h3>
          <p>Direct integration with government DBs for fraud-proof applications.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 KisanSahayak AI - Hackathon Special Edition</p>
      </footer>
    </div>
  )
}

export default App
