import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Button, Input } from "./index";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (data) => {
    try {
      setError("");
      const signingUp = await authService.createAcount(data);
      if (signingUp) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white">Join BlogSphere</h1>
          <p className="text-blue-100/90 mt-1">Create your free account</p>
        </div>

        {/* Form Body */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-center">
              <svg
                className="w-5 h-5 text-red-500 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(signup)} className="space-y-6">
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
            </div>

            <div className="relative">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email address",
                },
              })}
            />
            </div>

            <div className="relative">
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700"
            >
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
