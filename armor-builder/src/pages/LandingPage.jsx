import { Link } from 'react-router-dom';

const LandingPage = () => {

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="logo-icon">🛡️</span>
              Build Real Strength. Forge Your Armor.
            </h1>
            <h2 className="hero-subtitle">
              Track Your Progress Through Dan John's Armor Building Complex
            </h2>
            <p className="hero-description">
              Developed by world-renowned strength coach Dan John, the Armor Building Complex 
              is a time-tested kettlebell sequence designed to build the kind of muscle that 
              protects, supports, and endures — your body's natural armor.
            </p>
            <p className="hero-tagline">
              <strong>This isn't just about reps — it's about resilience.</strong>
            </p>
            <p className="hero-sequence">
              <strong>The Sequence:</strong> 2 Kettlebell Cleans + 1 Military Press + 3 Front Squats
            </p>
            <div className="cta-section">
              <Link to="/login" className="btn btn-primary btn-large cta-button">
                🔐 Login with Google to Start
              </Link>
              <p className="auth-note">
                Sign in to track your progress and save your workout data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <h3 className="section-title">Who is Dan John?</h3>
            <div className="dan-john-intro">
              <p className="coach-description">
                Dan John is a world-renowned strength coach, author, and philosopher of fitness. 
                With decades of experience training elite athletes and everyday warriors, Dan's 
                approach to strength training is both simple and profound.
              </p>
              <p className="philosophy">
                <em>"The goal is to keep the goal the goal."</em> - Dan John
              </p>
            </div>
            
            <h3 className="section-title">The Armor Building Complex</h3>
            <div className="complex-breakdown">
              <div className="exercise-card">
                <div className="exercise-number">2</div>
                <div className="exercise-details">
                  <h4>Kettlebell Cleans</h4>
                  <p>Power and explosiveness</p>
                </div>
              </div>
              <div className="exercise-card">
                <div className="exercise-number">1</div>
                <div className="exercise-details">
                  <h4>Military Press</h4>
                  <p>Upper body strength</p>
                </div>
              </div>
              <div className="exercise-card">
                <div className="exercise-number">3</div>
                <div className="exercise-details">
                  <h4>Front Squats</h4>
                  <p>Lower body power</p>
                </div>
              </div>
            </div>
            <p className="complex-note">
              This isn't about burning calories or "feeling the burn." It's about building the kind of 
              muscle that protects and supports your body through life's challenges — your body's natural armor.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="features">
        <div className="container">
          <h3 className="section-title">Why Train the Armor Building Complex?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h4>Build Functional Strength</h4>
              <p>Develop strength that transfers to real-world activities and daily life</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h4>Protect Your Body</h4>
              <p>Create muscular armor that shields you from injury and supports your joints</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h4>Improve Work Capacity</h4>
              <p>Build the endurance to work hard and recover quickly between efforts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Develop Power</h4>
              <p>Generate explosive force that carries over to sports and life</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h4>Mental Toughness</h4>
              <p>Build the psychological resilience that comes from conquering challenging workouts</p>
            </div>
          </div>
          
          <div className="app-features">
            <h4 className="app-features-title">App Features</h4>
            <div className="app-features-grid">
              <div className="app-feature">
                <span className="app-feature-icon">📊</span>
                <span>Progress Tracking</span>
              </div>
              <div className="app-feature">
                <span className="app-feature-icon">🏆</span>
                <span>Personal Bests</span>
              </div>
              <div className="app-feature">
                <span className="app-feature-icon">📱</span>
                <span>Mobile Optimized</span>
              </div>
              <div className="app-feature">
                <span className="app-feature-icon">☁️</span>
                <span>Cloud Sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h3>Your Armor Awaits</h3>
            <p>Stop chasing trends. Start building something that lasts. Your stronger, more resilient self is just one workout away.</p>
            <div className="final-cta-buttons">
              <Link to="/login" className="btn btn-primary btn-large">
                🔐 Login with Google to Start
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
        }

        .hero {
          background: var(--primary-gradient);
          color: white;
          padding: 80px 0;
          min-height: 70vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/><circle cx="10" cy="90" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          animation: float 20s infinite linear;
        }

        @keyframes float {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10px) translateY(-10px); }
          50% { transform: translateX(10px) translateY(-5px); }
          75% { transform: translateX(-5px) translateY(10px); }
          100% { transform: translateX(0) translateY(0); }
        }

        .hero-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title {
          font-size: var(--font-5xl);
          font-weight: 800;
          margin-bottom: var(--space-2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          text-shadow: var(--shadow-text);
          letter-spacing: -0.025em;
        }

        .logo-icon {
          font-size: var(--font-5xl);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }

        .hero-subtitle {
          font-size: var(--font-xl);
          font-weight: 300;
          margin-bottom: var(--space-6);
          opacity: 0.9;
        }

        .hero-description {
          font-size: var(--font-lg);
          line-height: 1.6;
          margin-bottom: var(--space-4);
          opacity: 0.9;
        }
        
        .hero-tagline {
          font-size: var(--font-lg);
          line-height: 1.6;
          margin-bottom: var(--space-4);
          opacity: 0.95;
        }
        
        .hero-sequence {
          font-size: var(--font-base);
          line-height: 1.5;
          margin-bottom: var(--space-8);
          opacity: 0.95;
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          border-left: 4px solid rgba(255, 255, 255, 0.4);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .hero-sequence::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .cta-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-5);
        }

        .cta-button {
          font-size: var(--font-lg);
          padding: var(--space-5) var(--space-10);
          min-width: 280px;
          max-width: 320px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .auth-note {
          font-size: var(--font-sm);
          opacity: 0.8;
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.5;
          text-align: center;
        }

        .about {
          padding: 80px 0;
          background: transparent;
        }

        .section-title {
          text-align: center;
          font-size: var(--font-3xl);
          font-weight: 600;
          margin-bottom: var(--space-12);
          color: var(--gray-800);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .complex-breakdown {
          display: flex;
          gap: var(--space-6);
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
          justify-content: center;
        }

        .exercise-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-6);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          min-width: 200px;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .exercise-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .exercise-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.4);
        }

        .exercise-number {
          font-size: var(--font-3xl);
          font-weight: 800;
          color: white;
          background: var(--primary-gradient);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .exercise-details h4 {
          font-size: var(--font-lg);
          font-weight: 600;
          margin-bottom: var(--space-1);
          color: #000000;
        }

        .exercise-details p {
          color: #000000;
          font-size: var(--font-sm);
        }

        .complex-note {
          text-align: center;
          font-size: var(--font-base);
          color: var(--gray-900);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .dan-john-intro {
          text-align: center;
          max-width: 700px;
          margin: 0 auto var(--space-12) auto;
        }
        
        .coach-description {
          font-size: var(--font-base);
          line-height: 1.6;
          color: #000000;
          margin-bottom: var(--space-6);
        }
        
        .philosophy {
          font-size: var(--font-lg);
          color: var(--primary-600);
          font-weight: 500;
          margin-bottom: 0;
          padding: var(--space-4) var(--space-6);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .features {
          padding: 80px 0;
          background: var(--gray-50);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-8);
          max-width: 800px;
          margin: 0 auto;
        }

        .feature-card {
          text-align: center;
          padding: var(--space-8) var(--space-6);
          background: var(--glass-bg-strong);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-2xl);
          background: rgba(255, 255, 255, 0.4);
        }

        .feature-icon {
          font-size: var(--font-5xl);
          margin-bottom: var(--space-4);
        }

        .feature-card h4 {
          font-size: var(--font-xl);
          font-weight: 600;
          margin-bottom: var(--space-3);
          color: #000000;
        }

        .feature-card p {
          color: #000000;
          line-height: 1.5;
        }
        
        .app-features {
          margin-top: var(--space-16);
          padding-top: var(--space-8);
          border-top: 1px solid var(--gray-200);
        }
        
        .app-features-title {
          text-align: center;
          font-size: var(--font-2xl);
          font-weight: 600;
          margin-bottom: var(--space-8);
          color: #000000;
        }
        
        .app-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .app-feature {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          font-size: var(--font-sm);
          font-weight: 600;
          color: var(--gray-700);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .app-feature:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: rgba(255, 255, 255, 0.4);
        }
        
        .app-feature-icon {
          font-size: var(--font-xl);
        }

        .cta {
          padding: 80px 0;
          background: var(--gray-900);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          opacity: 0.8;
        }

        .cta-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .cta h3 {
          font-size: var(--font-3xl);
          font-weight: 600;
          margin-bottom: var(--space-4);
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta p {
          font-size: var(--font-lg);
          margin-bottom: var(--space-8);
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .final-cta-buttons {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .final-cta-buttons .btn {
          font-size: var(--font-lg);
          padding: var(--space-4) var(--space-8);
          min-width: 200px;
          max-width: 280px;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .final-cta-buttons .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .final-cta-buttons .btn:hover::before {
          left: 100%;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 0;
          }

          .hero-title {
            font-size: var(--font-4xl);
            flex-direction: column;
            gap: var(--space-2);
          }

          .hero-subtitle {
            font-size: var(--font-lg);
          }

          .hero-description {
            font-size: var(--font-base);
          }

          .cta-section {
            gap: var(--space-3);
          }

          .cta-button {
            font-size: var(--font-base);
            padding: var(--space-4) var(--space-6);
            min-width: auto;
            width: 100%;
            max-width: 280px;
          }

          .section-title {
            font-size: var(--font-2xl);
          }

          .complex-breakdown {
            flex-direction: column;
            align-items: center;
          }

          .about, .features, .cta {
            padding: 60px 0;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
          
          .app-features-grid {
            grid-template-columns: 1fr;
            gap: var(--space-3);
          }
          
          .app-feature {
            font-size: var(--font-xs);
            padding: var(--space-3);
          }
          
          .final-cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .final-cta-buttons .btn {
            width: 100%;
            max-width: 320px;
            font-size: var(--font-base);
            padding: var(--space-4) var(--space-6);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;