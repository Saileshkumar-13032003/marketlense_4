import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/chart/${search.trim().toUpperCase()}`);
      setSearch("");
    }
  };

  return (
    <header className="bg-accent p-4 flex justify-center items-center rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="Search Symbol (AAPL, BTCUSDT, etc.)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-primary text-white outline-none"
        />
        <button
          type="submit"
          className="bg-green p-2 rounded-lg hover:bg-green/80 transition"
        >
          Go
        </button>
      </form>
    </header>
  );
}
