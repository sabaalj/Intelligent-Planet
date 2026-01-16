export type RoleTitle =
  | "Student"
  | "Researcher"
  | "Faculty"
  | "Industry Professional"
  | "Government"
  | "Other";

export type HearAbout =
  | "University"
  | "Social media"
  | "Email"
  | "Partner"
  | "Friend"
  | "";

export type UserProfile = {
  fullName: string;
  email: string; // normalized lowercase
  organization: string;
  roleTitle: RoleTitle;
  roleOtherText?: string;
  nationality: string;
  hearAbout?: HearAbout;
};

const KEY = "ip_current_user_v1";
const EVENT_NAME = "ip:user_updated";

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;

  if (!user) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, JSON.stringify(user));

  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onUserUpdated(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
