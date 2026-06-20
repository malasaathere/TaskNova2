import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TaskNovaLogo } from '../../components/layout/Sidebar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import showToast from '../../components/ui/Toast';
import { Phone, Mail, User as UserIcon, Lock, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { loginStep1, verifyLogin } = useAuth();
  const navigate = useNavigate();

  // Step 1 Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preference, setPreference] = useState('otp'); // 'otp' (Phone) or 'password' (Email)
  const [submitting1, setSubmitting1] = useState(false);

  // Step 2 Verification States
  const [step, setStep] = useState(1); // 1 = Login details, 2 = Verification code
  const [tempSession, setTempSession] = useState(null);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']); // For 6-box input
  const [passwordValue, setPasswordValue] = useState(''); // For password field
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown in seconds
  const [submitting2, setSubmitting2] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);

  const otpInputRefs = useRef([]);
  const timerRef = useRef(null);

  // Generate floating particle dots
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${12 + Math.random() * 10}s`,
    scale: 0.5 + Math.random() * 1.5,
  }));

  // Countdown timer for Step 2
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      clearInterval(timerRef.current);
      showToast.error("Verification code expired! Please request a new one.");
      setStep(1);
    }

    return () => clearInterval(timerRef.current);
  }, [step, timeLeft]);

  // Focus helper for 6-box OTP input
  const handleOtpChange = (index, val) => {
    if (isNaN(val)) return;
    const newOtp = [...verificationCode];
    newOtp[index] = val.slice(-1);
    setVerificationCode(newOtp);

    // Shift focus to next input
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1 Submit
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    // Predefined admin reject simulation: block any email with 'blocked@tms.com'
    if (email.toLowerCase().trim() === 'blocked@tms.com') {
      showToast.error("Login Failed — Contact your administrator to get access.");
      return;
    }

    setSubmitting1(true);
    try {
      const fullPhone = phoneNumber ? `${phonePrefix} ${phoneNumber}` : '';
      const session = await loginStep1(username, email, fullPhone, preference);
      
      setTempSession(session);
      setTimeLeft(300); // Reset timer to 5 minutes
      setStep(2);
      
      const method = preference === 'otp' ? 'phone' : 'email';
      const hintCode = preference === 'otp' ? ' (Use code: 123456)' : ' (Use password: Admin@1234)';
      showToast.success(`Verification sent! Check your ${method}. Expires in 5:00 minutes.${hintCode}`);
    } catch (err) {
      showToast.error("Login Failed — Verification could not be sent.");
    } finally {
      setSubmitting1(false);
    }
  };

  // Step 2 Submit
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const code = preference === 'otp' ? verificationCode.join('') : passwordValue;

    if (!code) {
      showToast.error("Please enter your verification code or password.");
      return;
    }

    setSubmitting2(true);
    try {
      const loggedUser = await verifyLogin(code, tempSession);
      
      // Full screen success flash
      setSuccessFlash(true);
      setTimeout(() => {
        showToast.success(`Hi, ${loggedUser.name}! Welcome back 🚀`);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const displayName = tempSession?.userDetails?.name || 'User';
      showToast.error(`Try again, ${displayName}. Code incorrect or expired.`);
    } finally {
      setSubmitting2(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1
    }}>
      {/* Background Animated Particles */}
      <div className="particle-background">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              transform: `scale(${p.scale})`,
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphic Form Card */}
      <Card 
        className="animate-pulse-cyan"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          zIndex: 2,
          position: 'relative',
          background: 'rgba(26, 58, 107, 0.65)'
        }}
      >
        {/* LOGO */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <TaskNovaLogo size={42} showText={true} />
        </div>

        {/* TAGLINE */}
        <p style={{
          textAlign: 'center',
          fontStyle: 'italic',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '24px'
        }}>
          "Your projects. Your team. In orbit."
        </p>

        {/* Glow Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--secondary-accent), transparent)',
          boxShadow: '0 0 8px var(--secondary-accent)',
          marginBottom: '32px'
        }} />

        {/* STEP 1: Details Entry */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div className="input-group">
              <span className="input-label">Username</span>
              <div className="input-field-prefixed">
                <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
                  <UserIcon size={16} />
                </span>
                <input 
                  type="text" 
                  placeholder="e.g. system_admin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <span className="input-label">Email Address</span>
              <div className="input-field-prefixed">
                <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  placeholder="e.g. admin@tms.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <span className="input-label">Phone Number</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={phonePrefix} 
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="input-field"
                  style={{ width: '90px', padding: '12px 8px', textAlign: 'center' }}
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                </select>
                <div className="input-field-prefixed" style={{ flex: 1 }}>
                  <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
                    <Phone size={16} />
                  </span>
                  <input 
                    type="tel" 
                    placeholder="555-0199" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Preference pill toggle */}
            <span className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Delivery Method</span>
            <div className="pill-toggle">
              <div 
                className={`pill-toggle-option ${preference === 'otp' ? 'active' : ''}`}
                onClick={() => setPreference('otp')}
              >
                Send OTP to Phone
              </div>
              <div 
                className={`pill-toggle-option ${preference === 'password' ? 'active' : ''}`}
                onClick={() => setPreference('password')}
              >
                Send Password to Email
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting1}
              className="animate-pulse-cyan"
              style={{ width: '100%', padding: '14px', textTransform: 'uppercase', fontSize: '0.95rem', letterSpacing: '0.05em', marginTop: '12px' }}
            >
              {submitting1 ? 'Connecting...' : 'Login'}
            </Button>
          </form>
        )}

        {/* STEP 2: Verification screen */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
                Verify Security Key
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {preference === 'otp' 
                  ? `Enter the 6-digit OTP code sent to your phone number.` 
                  : `Enter the administrator security password sent to ${tempSession?.userDetails?.email}.`
                }
              </p>
            </div>

            {preference === 'otp' ? (
              // 6-digit OTP fields
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  {verificationCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      maxLength="1"
                      className="input-field"
                      style={{ 
                        width: '50px', 
                        height: '52px', 
                        textAlign: 'center', 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        padding: 0
                      }}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Password input
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <span className="input-label">Access Password</span>
                <div className="input-field-prefixed">
                  <span className="input-prefix" style={{ display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} />
                  </span>
                  <input 
                    type="password" 
                    placeholder="Enter security password" 
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Countdown timer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '28px'
            }}>
              <span>Code expires in:</span>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                fontWeight: '700', 
                color: timeLeft < 60 ? 'var(--danger)' : 'var(--secondary-accent)',
                fontSize: '0.9rem',
                textShadow: timeLeft < 60 ? '0 0 8px rgba(255, 107, 107, 0.4)' : '0 0 8px rgba(0, 212, 255, 0.4)'
              }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* VERIFY BUTTON */}
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting2}
              style={{ width: '100%', padding: '14px', textTransform: 'uppercase', fontSize: '0.95rem', letterSpacing: '0.05em' }}
            >
              {submitting2 ? 'Verifying...' : 'Verify'}
            </Button>

            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{
                display: 'block',
                margin: '20px auto 0',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Small Helper Text */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginTop: '28px',
          marginBottom: 0
        }}>
          Access is granted by your administrator only
        </p>

        {/* Dev helper hints for testing logins */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(74, 144, 226, 0.05)',
          border: '1px dashed rgba(74, 144, 226, 0.15)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} /> Predefined Roles for Testing:
          </div>
          <div>• Admin: <strong>admin@tms.com</strong></div>
          <div>• Manager: <strong>manager@tms.com</strong></div>
          <div>• Collaborator: <strong>collab@tms.com</strong></div>
          <div style={{ marginTop: '4px' }}>* Blocked trigger email: <strong>blocked@tms.com</strong></div>
        </div>
      </Card>

      {/* Success Flash Animation Overlay */}
      {successFlash && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0A1628',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'flash-reveal 1.5s forwards'
        }}>
          <div style={{ textAlign: 'center', animation: 'zoom-rocket 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🚀</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>
              Launching orbit...
            </h1>
          </div>
        </div>
      )}

      {/* Style overrides for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flash-reveal {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes zoom-rocket {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1) translateY(-20px); }
        }
      `}} />
    </div>
  );
}
