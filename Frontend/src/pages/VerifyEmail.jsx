import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../features/authSlice";

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
  }));

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;
    setLocalError("");
    const res = await dispatch(verifyEmail(verificationCode)).unwrap().catch((err) => {
      setLocalError(err || "Verification failed");
      return null;
    });
    if (res !== null) {
      navigate("/");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold text-slate-800">Verify Email</CardTitle>
          <CardDescription className="text-slate-600">
            Enter the code sent to your email. Expires in 1 hour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 transition-colors"
                />
              ))}
            </div>

            {(localError || error) && <p className="text-sm text-red-600 text-center">{localError || error}</p>}

            <Button
              type="submit"
              disabled={code.join("").length !== 6 || loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            {/* Resend code functionality can be added here if implemented in Redux */}
            {/* <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium underline disabled:text-slate-400"
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </button>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
