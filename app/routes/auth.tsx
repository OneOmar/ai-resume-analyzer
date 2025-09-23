import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

// Page metadata
export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

// Reusable Auth button logic
const AuthButton = () => {
  const { isLoading, auth } = usePuterStore();

  if (isLoading) {
    return (
      <button className="auth-button animate-pulse">
        <p>Signing you in...</p>
      </button>
    );
  }

  return auth.isAuthenticated ? (
    <button className="auth-button" onClick={auth.signOut}>
      <p>Log Out</p>
    </button>
  ) : (
    <button className="auth-button" onClick={auth.signIn}>
      <p>Log In</p>
    </button>
  );
};

const Auth = () => {
  const { auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1]; // redirect target after login
  const navigate = useNavigate();

  // Redirect authenticated users to the intended page
  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>

          {/* Auth buttons */}
          <div>
            <AuthButton />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
