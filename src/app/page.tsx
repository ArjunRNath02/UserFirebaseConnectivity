"use client"

import { initializeApp } from "firebase/app";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { SetStateAction, useState } from "react";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID!
};


export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const handleNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setName(event.target.value);
  };

  const handleMailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setMessage(event.target.value);
  };

  const onSubmit = async () => {
    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await setDoc(doc(db, "users", email), {
        name,
        email,
        message,
      });
      setSuccess("Form submitted successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">Contact Form</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleMailChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-800" 
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleMessageChange}
              rows={4}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
              placeholder="Enter your message"
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}


