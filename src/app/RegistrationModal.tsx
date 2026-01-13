"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, CheckCircle, Building2, Globe2, Briefcase } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { setCurrentUser, type RoleTitle, type UserProfile } from "@/lib/userSession";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (user: UserProfile) => void;
}

type FieldKey =
  | "fullName"
  | "email"
  | "organization"
  | "roleTitle"
  | "roleOtherText"
  | "nationality"
  | "hearAbout";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const ROLE_OPTIONS: RoleTitle[] = [
  "Student",
  "Researcher",
  "Faculty",
  "Industry Professional",
  "Government",
  "Other",
];

const HEAR_ABOUT = ["University", "Social media", "Email", "Partner", "Friend"] as const;

// (خفيفة) قائمة جنسيات أساسية + تقدرين توسعينها لاحقًا
const NATIONALITIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "United States",
  "United Kingdom",
  "Canada",
  "France",
  "Germany",
  "India",
  "Pakistan",
  "China",
  "Japan",
  "South Korea",
];

export function RegistrationModal({ isOpen, onClose, onRegistered }: RegistrationModalProps) {
  const [mounted, setMounted] = useState(false);

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    organization: "",
    roleTitle: "" as RoleTitle | "",
    roleOtherText: "",
    nationality: "",
    hearAbout: "" as (typeof HEAR_ABOUT)[number] | "",
  });

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    fullName: false,
    email: false,
    organization: false,
    roleTitle: false,
    roleOtherText: false,
    nationality: false,
    hearAbout: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => setMounted(true), []);

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    if (!values.fullName.trim()) e.fullName = "This field is required.";
    if (!values.email.trim()) e.email = "This field is required.";
    else if (!emailRegex.test(values.email.trim())) e.email = "Invalid email.";

    if (!values.organization.trim()) e.organization = "This field is required.";

    if (!values.roleTitle) e.roleTitle = "This field is required.";
    if (values.roleTitle === "Other" && !values.roleOtherText.trim()) {
      e.roleOtherText = "Please specify your role/title.";
    }

    if (!values.nationality) e.nationality = "This field is required.";

    // hearAbout is optional -> no error
    return e;
  }, [values]);

  const hasError = (k: FieldKey) => Boolean(touched[k] && errors[k]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setValues({
        fullName: "",
        email: "",
        organization: "",
        roleTitle: "" as any,
        roleOtherText: "",
        nationality: "",
        hearAbout: "" as any,
      });
      setTouched({
        fullName: false,
        email: false,
        organization: false,
        roleTitle: false,
        roleOtherText: false,
        nationality: false,
        hearAbout: false,
      });
      setIsSubmitting(false);
      setIsSuccess(false);
      setSubmitError("");
    }
  }, [isOpen]);

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      organization: true,
      roleTitle: true,
      roleOtherText: true,
      nationality: true,
      hearAbout: true,
    });

    if (Object.keys(errors).length) return;

    const user: UserProfile = {
      fullName: values.fullName.trim(),
      email: normalizeEmail(values.email),
      organization: values.organization.trim(),
      roleTitle: values.roleTitle as RoleTitle,
      roleOtherText: values.roleTitle === "Other" ? values.roleOtherText.trim() : "",
      nationality: values.nationality,
      hearAbout: values.hearAbout || "",
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // email = doc id -> يمنع التكرار
      const ref = doc(db, "registrations", user.email);

      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSubmitError("This email is already registered.");
        return;
      }

      await setDoc(ref, {
        ...user,
        createdAt: serverTimestamp(),
      });

      // يعتبر “logged in” محليًا (Session) + نخلي الـ Navbar يقرأه
      setCurrentUser(user);
      onRegistered?.(user);

      setIsSuccess(true);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const ui = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] grid place-items-center p-4">
          <motion.button
            type="button"
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative p-8 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-[#005287]/80 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Event Registration</h2>
                  <p className="text-sm text-white/60 mt-0.5">Join Intelligent Planet 2026</p>
                </div>
              </div>
            </div>

            <div className="relative px-8 pb-8">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Successfully Registered!</h3>
                  <p className="text-white/60">Welcome aboard.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-5" noValidate>
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        value={values.fullName}
                        onChange={(e) => setValues((p) => ({ ...p, fullName: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("fullName")
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="Enter your full name"
                        aria-invalid={hasError("fullName")}
                      />
                    </div>
                    {hasError("fullName") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="email"
                        value={values.email}
                        onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("email")
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="your.email@example.com"
                        aria-invalid={hasError("email")}
                      />
                    </div>
                    {hasError("email") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.email}</p>}
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Organization</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Building2 className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        value={values.organization}
                        onChange={(e) => setValues((p) => ({ ...p, organization: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, organization: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("organization")
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="Your organization or institution"
                        aria-invalid={hasError("organization")}
                      />
                    </div>
                    {hasError("organization") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.organization}</p>}
                  </div>

                  {/* Role / Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Role / Title</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Briefcase className="w-5 h-5 text-white/40" />
                        </div>
                        <select
                          value={values.roleTitle}
                          onChange={(e) =>
                            setValues((p) => ({ ...p, roleTitle: e.target.value as RoleTitle }))
                          }
                          onBlur={() => setTouched((p) => ({ ...p, roleTitle: true }))}
                          className={[
                            "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none transition-all backdrop-blur-sm",
                            hasError("roleTitle")
                              ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                          ].join(" ")}
                          aria-invalid={hasError("roleTitle")}
                        >
                          <option value="" className="bg-black">Select a role</option>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-black">
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      {hasError("roleTitle") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.roleTitle}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Nationality</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <Globe2 className="w-5 h-5 text-white/40" />
                        </div>
                        <select
                          value={values.nationality}
                          onChange={(e) => setValues((p) => ({ ...p, nationality: e.target.value }))}
                          onBlur={() => setTouched((p) => ({ ...p, nationality: true }))}
                          className={[
                            "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none transition-all backdrop-blur-sm",
                            hasError("nationality")
                              ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                          ].join(" ")}
                          aria-invalid={hasError("nationality")}
                        >
                          <option value="" className="bg-black">Select a country</option>
                          {NATIONALITIES.map((c) => (
                            <option key={c} value={c} className="bg-black">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      {hasError("nationality") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.nationality}</p>}
                    </div>
                  </div>

                  {/* If Other */}
                  {values.roleTitle === "Other" && (
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Other (please specify)</label>
                      <input
                        value={values.roleOtherText}
                        onChange={(e) => setValues((p) => ({ ...p, roleOtherText: e.target.value }))}
                        onBlur={() => setTouched((p) => ({ ...p, roleOtherText: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("roleOtherText")
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="Type your role/title"
                        aria-invalid={hasError("roleOtherText")}
                      />
                      {hasError("roleOtherText") && <p className="text-red-400 text-xs mt-2 ml-1">{errors.roleOtherText}</p>}
                    </div>
                  )}

                  {/* Optional hear about */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      How did you hear about the event? <span className="text-white/50">(Optional)</span>
                    </label>
                    <select
                      value={values.hearAbout}
                      onChange={(e) => setValues((p) => ({ ...p, hearAbout: e.target.value as any }))}
                      className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20 transition-all backdrop-blur-sm"
                    >
                      <option value="" className="bg-black">Select one</option>
                      {HEAR_ABOUT.map((x) => (
                        <option key={x} value={x} className="bg-black">
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>

                  {submitError && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      {submitError}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all disabled:opacity-60"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? "Processing..." : "Complete Registration"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(ui, document.body);
}
