"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  MessageSquare,
  User,
  Loader,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ContactPage() {
  // Mock session for demo - replace with useSession() in your project
  const {data} = useSession();
  const [message, setMessage] = useState("");
  const [mail, setMail] = useState("");
  const [states, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: !!data?.user?.email ? mail:data?.user?.email,
        to: "ans.2012.1.25@gmail.com",
        message,
      }),
    });

    if (res.ok) {
      setStatus("✅ Message sent successfully!");
      setMessage("");
    } else {
      setStatus("❌ An error occurred, try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 rounded-full opacity-15 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 rounded-full opacity-8 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main card */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Contact Us, Send a message to us
            </h1>
          </div>

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
                  className={`w-full p-4 pl-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 transition-all duration-300 focus:outline-none
    ${data?.user?.email ? "cursor-not-allowed bg-gray-200" : "cursor-text"}`}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
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
              disabled={isLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
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
          {states && (
            <div className="mt-6 p-4 rounded-xl flex items-center gap-3 transform transition-all duration-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-lg">
              <span className="text-sm text-black font-medium">{states}</span>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
            We appreciate your message and strive to respond as quickly as
            possible
          </p>
        </div>
      </div>
    </div>
  );
}
