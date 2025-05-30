import React, { useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DailyInsight from "../pages/DailyInsight"
import WeeklyInsight from "../pages/WeeklyInsight"
import TodayInsight from "../pages/TodayInsight";
import { AuthContext } from "./AuthContext";

const InsightBoard = () => {
  const [showDailyInsight, setShowDailyInsight] = useState(false);
  const [showWeeklyInsight, setShowWeeklyInsight] = useState(false);
  const [showTodayInsight, setShowTodayInsight] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dish, setDish] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/dish`,
        { dish, type, quantity: Number(quantity) },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setDish("");
      setType("");
      setQuantity("");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto">
      <ToastContainer />
      <div className="sticky top-0 z-50 bg-base-100 border-b shadow-sm py-2.5 px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-base-content">
          Insight Board
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="btn btn-primary btn-sm sm:btn-md"
            onClick={() => setShowForm(true)}
          >
            + Add / Update Dish
          </button>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt="Profile"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60"
            >
              <li>
                <span className="font-semibold">{user.name}
                  <span className=" font-serif">{user.role}</span>
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-500">{user.email}</span>
              </li>
              <li>
                <button
                  className="text-red-500 font-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-start gap-5 pt-2.5">
        <button className="btn btn-primary btn-sm sm:btn-md"
          onClick={() => {
            setShowDailyInsight(true);
            setShowWeeklyInsight(false);
            setShowTodayInsight(false);
          }}>
          Daily-Insight
        </button>
        <button className="btn btn-primary btn-sm sm:btn-md"
          onClick={() => {
            setShowTodayInsight(false);
            setShowDailyInsight(false);
            setShowWeeklyInsight(true);
          }}>
          Weekly-Insight
        </button>
      </div>

      {
        showTodayInsight && (
          <TodayInsight />
        )
      }

      {
        showDailyInsight && (
          <DailyInsight />
        )
      }

      {
        showWeeklyInsight && (
          <WeeklyInsight />
        )
      }

      {
        showForm && (
          <form
            onSubmit={handleRegister}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          >
            <div className="bg-base-100 p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-4 sm:space-y-5 border border-base-300">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-base-content">
                {isUpdating ? "Update Dish" : "Add Dish"}
              </h2>

              <select
                className="select select-bordered w-full text-sm sm:text-base"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                required
              >
                <option disabled value="">
                  Select Dish
                </option>
                <option>Pizza</option>
                <option>Burger</option>
                <option>Pasta</option>
                <option>Momo</option>
                <option>HotDog</option>
              </select>

              <select
                className="select select-bordered w-full text-sm sm:text-base"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option disabled value="">
                  Select Type
                </option>
                <option>prepared</option>
                <option>consumed</option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                className="input input-bordered w-full text-sm sm:text-base"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-sm sm:btn-md btn-ghost border border-base-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm sm:btn-md btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        )
      }
    </div >
  );
};

export default InsightBoard;