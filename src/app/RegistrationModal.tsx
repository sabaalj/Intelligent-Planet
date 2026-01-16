"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Building2,
  Briefcase,
  Globe2,
  CheckCircle,
  LogIn,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { setCurrentUser, type UserProfile } from "@/lib/userSession";

type RoleTitle =
  | "Student"
  | "Researcher"
  | "Faculty"
  | "Industry Professional"
  | "Government"
  | "Other";

type HearAbout = "University" | "Social media" | "Email" | "Partner" | "Friend";

type Registration = {
  fullName: string;
  email: string; // normalized lowercase
  organization: string;
  roleTitle: RoleTitle;
  roleOtherText?: string;
  nationality: string;
  hearAbout?: HearAbout;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const ROLE_OPTIONS: RoleTitle[] = [
  "Student",
  "Researcher",
  "Faculty",
  "Industry Professional",
  "Government",
  "Other",
];

const HEAR_ABOUT: HearAbout[] = [
  "University",
  "Social media",
  "Email",
  "Partner",
  "Friend",
];

// ✅ Countries (Israel removed, Palestine included)
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Republic of the)","Congo (Democratic Republic of the)","Costa Rica","Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palestine","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe",
] as const;

type Mode = "register" | "login";

type FieldKey =
  | "fullName"
  | "email"
  | "organization"
  | "roleTitle"
  | "roleOtherText"
  | "nationality"
  | "hearAbout";

export default function RegistrationModal({
  isOpen,
  onClose,
  onRegistered,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: (user: UserProfile) => void;
}) {
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState<Mode>("register");

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    organization: "",
    roleTitle: "" as RoleTitle | "",
    roleOtherText: "",
    nationality: "",
    hearAbout: "" as HearAbout | "",
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
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset when opens
  useEffect(() => {
    if (!isOpen) return;

    setMode("register");
    setValues({
      fullName: "",
      email: "",
      organization: "",
      roleTitle: "",
      roleOtherText: "",
      nationality: "",
      hearAbout: "",
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
    setSubmitError("");
    setSubmitSuccess(false);
  }, [isOpen]);

  const normalizedEmail = useMemo(
    () => values.email.trim().toLowerCase(),
    [values.email]
  );

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};

    // Login: only name + email
    if (!values.fullName.trim()) e.fullName = "Full name is required.";

    if (!values.email.trim()) e.email = "Email address is required.";
    else if (!emailRegex.test(values.email.trim()))
      e.email = "Please enter a valid email address.";

    // Register-only fields
    if (mode === "register") {
      if (!values.organization.trim())
        e.organization = "Organization is required.";

      if (!values.roleTitle) e.roleTitle = "Role / Title is required.";
      if (values.roleTitle === "Other" && !values.roleOtherText.trim())
        e.roleOtherText = "Please specify your role / title.";

      if (!values.nationality) e.nationality = "Nationality is required.";
      // hearAbout optional
    }

    return e;
  }, [values, mode]);

  const hasErrors = Object.keys(errors).length > 0;

  const markTouched = (key: FieldKey) =>
    setTouched((t) => ({ ...t, [key]: true }));

  const onChange = <K extends keyof typeof values>(key: K, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setSubmitError("");
    setSubmitSuccess(false);

    // reset touched state lightly
    setTouched((t) => ({
      ...t,
      organization: false,
      roleTitle: false,
      roleOtherText: false,
      nationality: false,
      hearAbout: false,
    }));
  };

  const handleRegister = async () => {
    const payload: Registration = {
      fullName: values.fullName.trim(),
      email: normalizedEmail,
      organization: values.organization.trim(),
      roleTitle: values.roleTitle as RoleTitle,
      nationality: values.nationality,
    };

    if (values.roleTitle === "Other") payload.roleOtherText = values.roleOtherText.trim();
    if (values.hearAbout) payload.hearAbout = values.hearAbout as HearAbout;

    const ref = doc(db, "registrations", normalizedEmail);

    const snap = await getDoc(ref);
    if (snap.exists()) {
      setSubmitError("This email is already registered. Please log in.");
      return;
    }

    await setDoc(ref, { ...payload, createdAt: serverTimestamp() });

    const user: UserProfile = {
      fullName: payload.fullName,
      email: payload.email,
      organization: payload.organization,
      roleTitle: payload.roleTitle,
      roleOtherText: payload.roleOtherText,
      nationality: payload.nationality,
      hearAbout: payload.hearAbout || "",
    };
    
    setCurrentUser(user);
    onRegistered?.(user);

    setSubmitSuccess(true);
    setTimeout(() => onClose(), 700);
  };

  const handleLogin = async () => {
    const ref = doc(db, "registrations", normalizedEmail);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setSubmitError("No account found for this email. Please register first.");
      return;
    }

    const data = snap.data() as any;

    // Optional check: name matches (soft)
    const savedName = String(data.fullName || "").trim().toLowerCase();
    const inputName = values.fullName.trim().toLowerCase();
    if (savedName && inputName && savedName !== inputName) {
      setSubmitError("Name does not match this email. Please try again.");
      return;
    }

    setCurrentUser({
      fullName: data.fullName || values.fullName.trim(),
      email: normalizedEmail,
      organization: data.organization || "",
      roleTitle: data.roleTitle || "Student",
      roleOtherText: data.roleOtherText || "",
      nationality: data.nationality || "",
      hearAbout: data.hearAbout || "",
    });

    setSubmitSuccess(true);
    setTimeout(() => onClose(), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // mark only relevant touched fields
    setTouched((t) => ({
      ...t,
      fullName: true,
      email: true,
      ...(mode === "register"
        ? {
            organization: true,
            roleTitle: true,
            roleOtherText: true,
            nationality: true,
            hearAbout: true,
          }
        : {}),
    }));

    if (hasErrors) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      if (mode === "register") await handleRegister();
      else await handleLogin();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const showError = (k: FieldKey) => touched[k] && errors[k];

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 outline-none transition-all";
  const focusBase = "focus:border-blue-500/50 focus:bg-white/10";
  const errorRing = "border-red-500/70 bg-red-500/5";

  const ui = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] grid place-items-center px-4">
          <motion.button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-3xl border border-white/10 bg-[#0b1220]/90 shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.1)_inset]"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/15 via-transparent to-cyan-500/10 opacity-70 pointer-events-none" />

            <div className="relative p-8 sm:p-10">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>

              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/10 border border-white/10">
                  {mode === "register" ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <LogIn className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    {mode === "register" ? "Registration" : "Log in"}
                  </h2>

                  {/* ✅ replaced subtitle */}
                  <p className="text-white/60 text-sm sm:text-base">
                    {mode === "register" ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("login")}
                          className="text-blue-300 hover:text-blue-200 underline underline-offset-4 font-semibold"
                        >
                          Log in
                        </button>
                      </>
                    ) : (
                      <>
                        New here?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("register")}
                          className="text-blue-300 hover:text-blue-200 underline underline-offset-4 font-semibold"
                        >
                          Create an account
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                {/* Full Name */}
                <div>
                  <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    value={values.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    onBlur={() => markTouched("fullName")}
                    placeholder="e.g., Saba Salman"
                    className={[
                      inputBase,
                      focusBase,
                      showError("fullName") ? errorRing : "",
                    ].join(" ")}
                    autoComplete="name"
                  />
                  {showError("fullName") && (
                    <p className="mt-2 text-sm text-red-300">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    value={values.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    placeholder="name@example.com"
                    className={[
                      inputBase,
                      focusBase,
                      showError("email") ? errorRing : "",
                    ].join(" ")}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {showError("email") && (
                    <p className="mt-2 text-sm text-red-300">{errors.email}</p>
                  )}
                </div>

                {/* Register-only fields */}
                {mode === "register" && (
                  <>
                    <div>
                      <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Organization
                      </label>
                      <input
                        value={values.organization}
                        onChange={(e) => onChange("organization", e.target.value)}
                        onBlur={() => markTouched("organization")}
                        placeholder="University / Company / Institution"
                        className={[
                          inputBase,
                          focusBase,
                          showError("organization") ? errorRing : "",
                        ].join(" ")}
                      />
                      {showError("organization") && (
                        <p className="mt-2 text-sm text-red-300">
                          {errors.organization}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Role / Title
                        </label>
                        <select
                          value={values.roleTitle}
                          onChange={(e) => onChange("roleTitle", e.target.value)}
                          onBlur={() => markTouched("roleTitle")}
                          className={[
                            inputBase,
                            focusBase,
                            "appearance-none",
                            showError("roleTitle") ? errorRing : "",
                          ].join(" ")}
                        >
                          <option value="" disabled className="bg-[#0b1220]">
                            Select a role
                          </option>
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r} className="bg-[#0b1220]">
                              {r}
                            </option>
                          ))}
                        </select>
                        {showError("roleTitle") && (
                          <p className="mt-2 text-sm text-red-300">
                            {errors.roleTitle}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          If Other, specify
                        </label>
                        <input
                          value={values.roleOtherText}
                          onChange={(e) =>
                            onChange("roleOtherText", e.target.value)
                          }
                          onBlur={() => markTouched("roleOtherText")}
                          placeholder="Type your role / title"
                          disabled={values.roleTitle !== "Other"}
                          className={[
                            inputBase,
                            focusBase,
                            values.roleTitle !== "Other"
                              ? "opacity-40 cursor-not-allowed"
                              : "",
                            showError("roleOtherText") ? errorRing : "",
                          ].join(" ")}
                        />
                        {showError("roleOtherText") && (
                          <p className="mt-2 text-sm text-red-300">
                            {errors.roleOtherText}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        Nationality
                      </label>
                      <input
                        list="countries"
                        value={values.nationality}
                        onChange={(e) => onChange("nationality", e.target.value)}
                        onBlur={() => markTouched("nationality")}
                        placeholder="Select or type a country"
                        className={[
                          inputBase,
                          focusBase,
                          showError("nationality") ? errorRing : "",
                        ].join(" ")}
                      />
                      <datalist id="countries">
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      {showError("nationality") && (
                        <p className="mt-2 text-sm text-red-300">
                          {errors.nationality}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-white/80 text-sm mb-2 flex items-center gap-2">
                        <Globe2 className="w-4 h-4" />
                        How did you hear about the event? (Optional)
                      </label>
                      <select
                        value={values.hearAbout}
                        onChange={(e) => onChange("hearAbout", e.target.value)}
                        onBlur={() => markTouched("hearAbout")}
                        className={[inputBase, focusBase, "appearance-none"].join(
                          " "
                        )}
                      >
                        <option value="" className="bg-[#0b1220]">
                          Select an option
                        </option>
                        {HEAR_ABOUT.map((h) => (
                          <option key={h} value={h} className="bg-[#0b1220]">
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {submitError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                    {submitError}
                  </div>
                )}

                {submitSuccess && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-200 text-sm">
                    {mode === "register"
                      ? "Registration completed successfully!"
                      : "Logged in successfully!"}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:shadow-[0_0_45px_rgba(59,130,246,0.55)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                >
                  {isSubmitting
                    ? "Please wait..."
                    : mode === "register"
                    ? "Complete Registration"
                    : "Log in"}
                </motion.button>

                <p className="text-center text-xs text-white/40">
                  {mode === "register"
                    ? "By submitting, you agree that your information will be used for event registration purposes."
                    : "Your email must match an existing registration."}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(ui, document.body);
}
