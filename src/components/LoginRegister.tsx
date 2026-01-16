"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Chrome,
  Facebook,
  Github,
  Linkedin,
} from "lucide-react";

import styles from "../styles/loginRegister.module.css";

type LoginForm = {
  email: string;
  password: string;
};

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type Errors = {
  login: string | null;
  register: string | null;
};

type SocialProvider = "google" | "facebook" | "github" | "linkedin";

type Props = {
  onLoginSubmit?: (data: LoginForm) => void | Promise<void>;
  onRegisterSubmit?: (data: RegisterForm) => void | Promise<void>;
  onSocialAuth?: (provider: SocialProvider) => void | Promise<void>;
  defaultReturnUrl?: string;
};

export default function LoginRegister({
  onLoginSubmit,
  onRegisterSubmit,
  onSocialAuth,
  defaultReturnUrl = "/",
}: Props) {
  const [active, setActive] = useState(false);

  const [loginData, setLoginData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({ login: null, register: null });

  const router = useRouter();
  const searchParams = useSearchParams();

  const returnUrl = useMemo(() => {
    return searchParams?.get("returnUrl") || defaultReturnUrl;
  }, [searchParams, defaultReturnUrl]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const fakeDelay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, login: null }));
    setLoading(true);

    try {
      if (!loginData.email || !loginData.password) {
        throw new Error("Please fill in all fields");
      }

      if (onLoginSubmit) {
        await onLoginSubmit(loginData);
      } else {
        await fakeDelay(700);
        localStorage.setItem("mock_token", "demo-token");
      }

      router.push(returnUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setErrors((prev) => ({ ...prev, login: message }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, register: null }));
    setLoading(true);

    try {
      if (
        !registerData.firstName ||
        !registerData.lastName ||
        !registerData.email ||
        !registerData.password
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (registerData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (onRegisterSubmit) {
        await onRegisterSubmit(registerData);
      } else {
        await fakeDelay(900);
        localStorage.setItem("mock_token", "demo-token");
      }

      router.push("/user-profile");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setErrors((prev) => ({ ...prev, register: message }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoading(true);

      if (onSocialAuth) {
        await onSocialAuth(provider);
      } else {
        await fakeDelay(500);
        alert(
          `Authenticating with ${provider}...\n\nThis is a UI-only placeholder. Connect it to your OAuth flow later.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const containerClassName = active
    ? `${styles.container} ${styles.containerActive}`
    : styles.container;

  return (
    <div className={styles.loginRegisterWrapper}>
      <div className={containerClassName}>
        {/* Login Form */}
        <div className={`${styles.formBox} ${styles.login}`}>
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            <div className={styles.inputBox}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                autoComplete="email"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <Mail size={18} />
              </span>
            </div>

            <div className={styles.inputBox}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                autoComplete="current-password"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <Lock size={18} />
              </span>
            </div>

            <div className={styles.forgotLink}>
              <a href="#forgot-password">Forgot Password?</a>
            </div>

            {errors.login && (
              <div className={styles.formError}>{errors.login}</div>
            )}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading && active === false ? "Logging in..." : "Login"}
            </button>

            <p>or login with social platforms</p>

            <div className={styles.socialIcons}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("google")}
                aria-label="Login with Google"
                disabled={loading}
              >
                <Chrome size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("facebook")}
                aria-label="Login with Facebook"
                disabled={loading}
              >
                <Facebook size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("github")}
                aria-label="Login with GitHub"
                disabled={loading}
              >
                <Github size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("linkedin")}
                aria-label="Login with LinkedIn"
                disabled={loading}
              >
                <Linkedin size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className={`${styles.formBox} ${styles.register}`}>
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>

            <div className={styles.inputBox}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
                autoComplete="given-name"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <User size={18} />
              </span>
            </div>

            <div className={styles.inputBox}>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
                autoComplete="family-name"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <User size={18} />
              </span>
            </div>

            <div className={styles.inputBox}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                autoComplete="email"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <Mail size={18} />
              </span>
            </div>

            <div className={styles.inputBox}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                autoComplete="new-password"
              />
              <span className={styles.inputIcon} aria-hidden="true">
                <Lock size={18} />
              </span>
            </div>

            {errors.register && (
              <div className={styles.formError}>{errors.register}</div>
            )}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading && active === true ? "Registering..." : "Register"}
            </button>

            <p>or register with social platforms</p>

            <div className={styles.socialIcons}>
              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("google")}
                aria-label="Register with Google"
                disabled={loading}
              >
                <Chrome size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("facebook")}
                aria-label="Register with Facebook"
                disabled={loading}
              >
                <Facebook size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("github")}
                aria-label="Register with GitHub"
                disabled={loading}
              >
                <Github size={18} />
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                onClick={() => handleSocialLogin("linkedin")}
                aria-label="Register with LinkedIn"
                disabled={loading}
              >
                <Linkedin size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className={styles.toggleBox}>
          <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button
              className={styles.btn}
              onClick={() => setActive(true)}
              type="button"
              disabled={loading}
            >
              Register
            </button>
          </div>

          <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className={styles.btn}
              onClick={() => setActive(false)}
              type="button"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
