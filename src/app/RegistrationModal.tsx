"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, CheckCircle } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FieldKey = "name" | "email";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [mounted, setMounted] = useState(false);

  const [values, setValues] = useState({ name: "", email: "" });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => setMounted(true), []);

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!values.name.trim()) e.name = "This field is required.";
    if (!values.email.trim()) e.email = "This field is required.";
    else if (!emailRegex.test(values.email.trim())) e.email = "Invalid email.";
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
      setValues({ name: "", email: "" });
      setTouched({ name: false, email: false });
      setIsSubmitting(false);
      setIsSuccess(false);
      setSubmitError("");
    }
  }, [isOpen]);

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true });
    if (Object.keys(errors).length) return;

    const name = values.name.trim();
    const email = normalizeEmail(values.email);

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const ref = doc(db, "registrations", email);

      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSubmitError("You're already registered.");
        return;
      }

      await setDoc(ref, {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
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
            className="relative w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
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
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Register Now
                  </h2>
                  <p className="text-sm text-white/60 mt-0.5">
                    Join Intelligent Planet 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="relative px-8 pb-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Successfully Registered!
                  </h3>
                  <p className="text-white/60">We'll contact you soon via email</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-5" noValidate>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white/90 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={values.name}
                        onChange={(e) =>
                          setValues((p) => ({ ...p, name: e.target.value }))
                        }
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("name")
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="Enter your full name"
                        aria-invalid={hasError("name")}
                      />
                    </div>

                    <AnimatePresence>
                      {hasError("name") && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-xs mt-2 ml-1"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white/90 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Mail
                          className={`w-5 h-5 transition-colors ${
                            hasError("email") || submitError
                              ? "text-red-400"
                              : "text-white/40"
                          }`}
                        />
                      </div>

                      <input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => {
                          setValues((p) => ({ ...p, email: e.target.value }));
                          if (submitError) setSubmitError("");
                        }}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        className={[
                          "w-full bg-white/5 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all backdrop-blur-sm",
                          hasError("email") || submitError
                            ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border border-white/10 focus:border-[#005287] focus:ring-2 focus:ring-[#005287]/20",
                        ].join(" ")}
                        placeholder="example@email.com"
                        aria-invalid={hasError("email") || Boolean(submitError)}
                      />
                    </div>

                    <AnimatePresence>
                      {(hasError("email") || submitError) && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-400 text-xs mt-2 ml-1"
                        >
                          {submitError || errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#005287] hover:bg-[#004170] disabled:bg-[#005287]/50 text-white font-bold py-3.5 rounded-xl transition-all uppercase tracking-wider relative overflow-hidden group mt-6 border border-white/10"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">Register</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {!isSuccess && (
              <div className="relative px-8 pb-6">
                <p className="text-xs text-white/40 text-center">
                  By registering, you agree to our terms and conditions
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(ui, document.body);
}
