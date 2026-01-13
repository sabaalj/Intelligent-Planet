// src/lib/userSession.ts
export type RoleTitle =
  | "Student"
  | "Researcher"
  | "Faculty"
  | "Industry Professional"
  | "Government"
  | "Other";

export type UserProfile = {
  fullName: string;
  email: string;
  organization: string;
  roleTitle: RoleTitle;
  roleOtherText?: string;
  nationality: string;
  hearAbout?: "University" | "Social media" | "Email" | "Partner" | "Friend" | "";
};

const KEY = "ip_current_user_v1";

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
}

export function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
