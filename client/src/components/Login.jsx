import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { email: trimmedEmail, password: trimmedPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");
        setTimeout(() => {
          navigate("/login/insight-board");
        }, 1000);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/reset-password`,
        { email: trimmedEmail, password: trimmedPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Reset Successful");
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(res.data.message || "Reset failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md bg-white backdrop-blur-md dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {isLogin ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">Login</h2>
            <form className="space-y-5" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#009689]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#009689]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full cursor-pointer ${loading ? "bg-[#009689]/60 cursor-not-allowed" : "bg-[#009689] hover:bg-[#009689]"
                  } text-white py-3 rounded-md transition`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p
              className="mt-4 text-center text-[#009689] cursor-pointer dark:text-[#009689]"
              onClick={() => setIsLogin(false)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
              Reset Password
            </h2>
            <form className="space-y-5" onSubmit={handleReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#009689]"
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white/70 dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#009689]"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full cursor-pointer ${loading ? 'bg-[#009689]/60 cursor-not-allowed' : 'bg-[#009689] hover:bg-[#009689]'} text-white py-3 rounded-md transition`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <p
              className="mt-4 text-center text-[#009689] cursor-pointer dark:text-[#009689]"
              onClick={() => setIsLogin(true)}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login