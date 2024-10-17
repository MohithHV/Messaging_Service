// components/LoginForm.tsx

import React, { useState } from "react";

interface LoginFormProps {
  handleLogin: (username: string) => void; // Define prop type
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLogin }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    handleLogin(inputValue); // Call handleLogin with the input value
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Enter your username"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;

