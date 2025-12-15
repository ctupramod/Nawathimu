import { User, ChatMessage, CheckInLog, AdminConfig } from '../types';

const STORAGE_KEYS = {
  USERS: 'rr_users',
  CURRENT_USER: 'rr_current_user',
  CHATS: 'rr_chats',
  LOGS: 'rr_logs', // Keyed by username like rr_logs_username
  CONFIG: 'rr_admin_config'
};

const DEFAULT_CONFIG: AdminConfig = {
  emergencyContacts: [
    { name: "National Dangerous Drugs Control Board", number: "1984" },
    { name: "Sumithrayo (Suicide Prevention)", number: "011 269 6666" }
  ],
  herbalRemedies: [
    { name: "Samahan", description: "Instant herbal tea for body aches and colds." },
    { name: "Ginger Tea", description: "Helps with nausea and digestion." },
    { name: "Gotu Kola", description: "Improves mental clarity and reduces anxiety." }
  ]
};

// Initialize Storage
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  // Create default admin
  const admin: User = {
    username: 'admin',
    name: 'Administrator',
    addiction: 'None',
    quitDate: new Date().toISOString(),
    coins: 9999,
    level: 99,
    city: 'Colombo',
    ageRange: '35-44',
    isAdmin: true
  };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([admin]));
  // Store plain text password separately for mock auth (In real app, hash this!)
  localStorage.setItem('rr_auth_admin', 'admin'); 
}

if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
  localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify([]));
}

if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
}

export const StorageService = {
  // Auth
  registerUser: (user: User, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find((u: User) => u.username === user.username)) {
      return false; // User exists
    }
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(`rr_auth_${user.username}`, password);
    return true;
  },

  loginUser: (username: string, password: string): User | null => {
    const storedPass = localStorage.getItem(`rr_auth_${username}`);
    if (storedPass === password) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      return users.find((u: User) => u.username === username) || null;
    }
    return null;
  },

  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  // Logs
  getUserLogs: (username: string): CheckInLog[] => {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEYS.LOGS}_${username}`) || '[]');
  },

  saveUserLog: (username: string, log: CheckInLog) => {
    const logs = StorageService.getUserLogs(username);
    logs.push(log);
    localStorage.setItem(`${STORAGE_KEYS.LOGS}_${username}`, JSON.stringify(logs));
  },

  // Chat
  getMessages: (): ChatMessage[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHATS) || '[]');
  },

  sendMessage: (msg: ChatMessage) => {
    const chats = StorageService.getMessages();
    chats.push(msg);
    // Keep only last 50 messages
    if (chats.length > 50) chats.shift();
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  // Admin Config
  getConfig: (): AdminConfig => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || JSON.stringify(DEFAULT_CONFIG));
  },

  saveConfig: (config: AdminConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }
};
