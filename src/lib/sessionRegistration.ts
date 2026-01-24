import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export type RegisteredSession = {
  id: string;
  building: "Building 57" | "Building 78";
  day: "Day 1" | "Day 2" | "Day 3";
  date: string;
  time: string;
  title: string;
  speakers?: string;
};

const EVENT_NAME = "ip:sessions_updated";

export function buildSessionId(input: {
  building: RegisteredSession["building"];
  day: RegisteredSession["day"];
  time: string;
  title: string;
}) {
  const clean = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  return `${clean(input.building)}__${clean(input.day)}__${clean(
    input.time
  )}__${clean(input.title)}`;
}

export function notifySessionsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function onSessionsUpdated(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export async function fetchRegisteredSessions(email: string): Promise<RegisteredSession[]> {
  const userEmail = email.trim().toLowerCase();
  const col = collection(db, "registrations", userEmail, "sessions");
  const snap = await getDocs(col);

  const sessions: RegisteredSession[] = [];
  snap.forEach((d) => {
    const data = d.data() as any;
    sessions.push({
      id: d.id,
      building: data.building,
      day: data.day,
      date: data.date,
      time: data.time,
      title: data.title,
      speakers: data.speakers || "",
    });
  });

  return sessions;
}

export async function isSessionRegistered(email: string, sessionId: string): Promise<boolean> {
  const userEmail = email.trim().toLowerCase();
  const ref = doc(db, "registrations", userEmail, "sessions", sessionId);
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function registerSession(email: string, session: Omit<RegisteredSession, "id">): Promise<string> {
  const userEmail = email.trim().toLowerCase();

  const sessionId = buildSessionId({
    building: session.building,
    day: session.day,
    time: session.time,
    title: session.title,
  });

  const ref = doc(db, "registrations", userEmail, "sessions", sessionId);

  // idempotent (لو ضغط مرتين ما يسوي دبل)
  await setDoc(
    ref,
    {
      id: sessionId,
      ...session,
      email: userEmail,
      registeredAt: serverTimestamp(),
    },
    { merge: true }
  );

  notifySessionsUpdated();
  return sessionId;
}
