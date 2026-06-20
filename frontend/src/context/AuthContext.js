import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'admin@tms.com': {
    id: 'u-admin',
    name: 'System Admin',
    username: 'admin',
    email: 'admin@tms.com',
    phone: '+1 (555) 019-9234',
    role: 'Admin',
    department: 'Operations',
    avatar: 'SA',
    status: 'Active',
    bio: 'Lead system administrator. Oversees global resource allocation, user authorization, and system auditing.'
  },
  'manager@tms.com': {
    id: 'u-manager',
    name: 'Sarah Jenkins',
    username: 'sjenkins',
    email: 'manager@tms.com',
    phone: '+1 (555) 014-4321',
    role: 'Project Manager',
    department: 'Engineering',
    avatar: 'SJ',
    status: 'Active',
    bio: 'Senior Technical Project Manager with 8+ years of Agile delivery experience. Managing core TaskNova initiatives.'
  },
  'collab@tms.com': {
    id: 'u-collab',
    name: 'Alex Rivera',
    username: 'arivera',
    email: 'collab@tms.com',
    phone: '+1 (555) 012-2987',
    role: 'Collaborator',
    department: 'Development',
    avatar: 'AR',
    status: 'Active',
    bio: 'Full Stack Software Engineer. Focused on UI component libraries, responsive design, and React app state.'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tasknova_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('tasknova_user');
      }
    }
    setLoading(false);
  }, []);

  // Simulates step 1: Login entry
  const loginStep1 = async (username, email, phone, preference) => {
    // Artificial loading time
    await new Promise(resolve => setTimeout(resolve, 800));

    const emailLower = email.toLowerCase().trim();
    
    // Check if the user is one of our predefined accounts, otherwise dynamically generate a mock user
    let userDetails = MOCK_USERS[emailLower];
    if (!userDetails) {
      // Allow dynamic mock login for custom emails
      userDetails = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name: username || 'Guest User',
        username: username || 'guest',
        email: emailLower,
        phone: phone || '+1 (555) 000-0000',
        role: emailLower.includes('admin') ? 'Admin' : (emailLower.includes('manager') ? 'Project Manager' : 'Collaborator'),
        department: 'Operations',
        avatar: (username || 'GU').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        status: 'Active',
        bio: 'TaskNova team member.'
      };
    }

    // Return verification token along with user details (simulated)
    return {
      token: 'mock_token_' + Date.now(),
      userDetails,
      preference
    };
  };

  // Simulates step 2: Verification of OTP / Password
  const verifyLogin = async (code, tempSession) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // For testing: correct code is '123456' or password 'Admin@1234'
    const isOTP = tempSession.preference === 'otp';
    const isValid = isOTP ? (code === '123456') : (code === 'Admin@1234' || code === '123456');

    if (isValid) {
      const loggedUser = tempSession.userDetails;
      setUser(loggedUser);
      localStorage.setItem('tasknova_user', JSON.stringify(loggedUser));
      return loggedUser;
    } else {
      throw new Error('Code incorrect or expired');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('tasknova_user');
  };

  // Switch role on the fly (helper for developers/reviewers to view different dashboards)
  const switchRole = (role) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        role,
        // Override name and credentials if switching to standard mock users
        ...(role === 'Admin' ? MOCK_USERS['admin@tms.com'] : {}),
        ...(role === 'Project Manager' ? MOCK_USERS['manager@tms.com'] : {}),
        ...(role === 'Collaborator' ? MOCK_USERS['collab@tms.com'] : {})
      };
      localStorage.setItem('tasknova_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfile = (profileData) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...profileData };
      
      // Update avatar initials if name changes
      if (profileData.name) {
        updated.avatar = profileData.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }

      localStorage.setItem('tasknova_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginStep1, 
      verifyLogin, 
      logout, 
      switchRole, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
