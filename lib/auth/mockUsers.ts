import { User, SignUpCredentials } from "@/types/auth";

export interface MockUserRecord extends User {
  passwordHash: string; // Mock password representation
}

export const INITIAL_MOCK_USERS: MockUserRecord[] = [
  {
    id: "usr_demo_01",
    name: "Dr. Rajesh Sharma",
    email: "demo@example.com",
    phone: "+91 92629 97777",
    passwordHash: "password123",
    createdAt: "2024-01-15T10:30:00Z",
    isVerified: true
  },
  {
    id: "usr_demo_02",
    name: "Priya Sengupta",
    email: "guest@reliance.com",
    phone: "+91 98310 12345",
    passwordHash: "welcome123",
    createdAt: "2024-02-20T14:15:00Z",
    isVerified: true
  }
];

const STORAGE_USERS_KEY = "hotel_reliance_registered_users";
const STORAGE_CURRENT_USER_KEY = "hotel_reliance_current_user";
const STORAGE_BOOKING_INTENT_KEY = "hotel_reliance_booking_intent";

export function getRegisteredUsers(): MockUserRecord[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_USERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load registered users from localStorage", err);
    return INITIAL_MOCK_USERS;
  }
}

export function saveRegisteredUsers(users: MockUserRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save registered users to localStorage", err);
  }
}

export function findUserByEmail(email: string): MockUserRecord | undefined {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

export function authenticateMockUser(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: "Account not found. Please create an account first."
    };
  }

  if (user.passwordHash !== password) {
    return {
      success: false,
      error: "Incorrect password. Please verify and try again."
    };
  }

  // Success - strip password from return
  const { passwordHash: _, ...safeUser } = user;
  return {
    success: true,
    user: safeUser
  };
}

export function registerMockUser(
  credentials: SignUpCredentials
): { success: boolean; user?: User; error?: string } {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const existing = findUserByEmail(normalizedEmail);

  if (existing) {
    return {
      success: false,
      error: "An account with this email address already exists. Please sign in."
    };
  }

  const users = getRegisteredUsers();
  const newUser: MockUserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: credentials.name.trim(),
    email: normalizedEmail,
    phone: credentials.phone.trim(),
    passwordHash: credentials.password,
    createdAt: new Date().toISOString(),
    isVerified: true
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const { passwordHash: _, ...safeUser } = newUser;
  return {
    success: true,
    user: safeUser
  };
}

export function updateMockUser(
  userId: string,
  updates: Partial<Omit<MockUserRecord, "id" | "passwordHash">>
): { success: boolean; user?: User; error?: string } {
  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: "User record not found." };
  }

  users[index] = {
    ...users[index],
    ...updates
  };
  saveRegisteredUsers(users);

  const { passwordHash: _, ...safeUser } = users[index];
  return {
    success: true,
    user: safeUser
  };
}

export function getStoredCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error("Failed to update current user in storage", err);
  }
}

export function getStoredBookingIntent(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_BOOKING_INTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredBookingIntent(intent: any | null): void {
  if (typeof window === "undefined") return;
  try {
    if (intent) {
      sessionStorage.setItem(STORAGE_BOOKING_INTENT_KEY, JSON.stringify(intent));
    } else {
      sessionStorage.removeItem(STORAGE_BOOKING_INTENT_KEY);
    }
  } catch (err) {
    console.error("Failed to update booking intent in storage", err);
  }
}
