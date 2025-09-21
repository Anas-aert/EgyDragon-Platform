"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  User,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AdsenseScript from "../_components/Adsenseads";

export default function ContactPage() {
  const { data } = useSession();
  const [message, setMessage] = useState("");
  const [mail, setMail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusType, setStatusType] = useState<"success" | "error" | "warning">(
    "success"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    const fromEmail = data?.user?.email || mail;

    try {
      const res = await fetch("https://egydragon-anas.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: "anas.2012.1.25@gmail.com",
          message,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setStatusType("success");
        setMessage("");
        if (!data?.user?.email) setMail("");
      } else {
        // معالجة أخطاء مختلفة
        if (result.unsupported_provider) {
          setStatus(`⚠️ ${result.error}`);
          setStatusType("warning");
        } else {
          setStatus(`❌ ${result.error || "An error occurred, try again."}`);
          setStatusType("error");
        }
      }
    } catch (e) {
      setStatus(
        "❌ Network error. Please check your connection and try again."
      );
      console.log(e);
      setStatusType("error");
    }

    setIsLoading(false);
  };

  // فحص إذا كان الإيميل من Outlook
  const isOutlookEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return (
      domain?.includes("outlook") ||
      domain?.includes("hotmail") ||
      domain?.includes("live")
    );
  };

  const currentEmail = data?.user?.email || mail;
  const showOutlookWarning = currentEmail && isOutlookEmail(currentEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <AdsenseScript />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 rounded-full opacity-15 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 rounded-full opacity-8 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Contact Us, Send a message to us
            </h1>
          </div>

          {/* تحذير Outlook */}
          {showOutlookWarning && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Outlook/Hotmail not supported
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {
                      "Please use Gmail or another email provider due to Microsoft's security restrictions."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-emerald-500" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={data?.user?.email || mail}
                  disabled={Boolean(data?.user?.email)}
                  onChange={(m) => setMail(m.target.value)}
                  placeholder="Enter your email (Gmail recommended)"
                  required={!data?.user?.email}
                  className={`w-full p-4 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 transition-all duration-300 focus:outline-none rounded-xl text-gray-600
                    ${
                      data?.user?.email
                        ? "cursor-not-allowed bg-gray-200 border-gray-200"
                        : showOutlookWarning
                        ? "border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                        : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 cursor-text"
                    }`}
                />
                <Mail
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    showOutlookWarning ? "text-orange-400" : "text-emerald-400"
                  }`}
                />
              </div>
            </div>

            {/* Message field */}
            <div className="relative">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none resize-none bg-gradient-to-br from-white to-purple-50/30"
                />
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-purple-400" />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || showOutlookWarning}
              className={`w-full px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300 flex items-center justify-center gap-3 
                ${
                  showOutlookWarning
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : isLoading
                    ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 opacity-50 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : showOutlookWarning ? (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Email Provider Not Supported
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send
                </>
              )}
            </button>
          </form>

          {/* Status message */}
          {status && (
            <div
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 shadow-lg border ${
                statusType === "success"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                  : statusType === "warning"
                  ? "bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border-orange-200"
                  : "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200"
              }`}
            >
              <span className="text-sm text-black font-medium">{status}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
            We appreciate your message and strive to respond as quickly as
            possible
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Currently supporting Gmail and other providers (Outlook/Hotmail not
            supported)
          </p>
        </div>
      </div>
    </div>
  );
}
