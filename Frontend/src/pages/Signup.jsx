import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { signup } from "../features/authSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
  }));

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [localError, setLocalError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (formData.password !== formData.confirmPassword) {
      return setLocalError("Passwords do not match");
    }
    const res = await dispatch(
      signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    ).unwrap().catch(() => null);
    if (res) {
      navigate("/verify-email");
    }
  };

  const isFieldFocused = (fieldName) => focusedField === fieldName || formData[fieldName];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-slate-800">Create Account</CardTitle>
          <CardDescription className="text-slate-600">Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField("")}
                className="peer h-12 pt-4 pb-2 px-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder=" "
                required
              />
              <Label
                htmlFor="username"
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  isFieldFocused("username") ? "top-1 text-xs text-blue-600" : "top-3 text-base text-slate-500"
                }`}
              >
                Username
              </Label>
            </div>

            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className="peer h-12 pt-4 pb-2 px-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder=" "
                required
              />
              <Label
                htmlFor="email"
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  isFieldFocused("email") ? "top-1 text-xs text-blue-600" : "top-3 text-base text-slate-500"
                }`}
              >
                Email
              </Label>
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className="peer h-12 pt-4 pb-2 px-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder=" "
                required
              />
              <Label
                htmlFor="password"
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  isFieldFocused("password") ? "top-1 text-xs text-blue-600" : "top-3 text-base text-slate-500"
                }`}
              >
                Password
              </Label>
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField("")}
                className="peer h-12 pt-4 pb-2 px-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                placeholder=" "
                required
              />
              <Label
                htmlFor="confirmPassword"
                className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                  isFieldFocused("confirmPassword") ? "top-1 text-xs text-blue-600" : "top-3 text-base text-slate-500"
                }`}
              >
                Confirm Password
              </Label>
            </div>

            {(localError || error) && <p className="text-sm text-red-600 text-center">{localError || error}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
