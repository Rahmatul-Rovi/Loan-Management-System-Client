import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState("");
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  // Observe theme changes
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(currentTheme);
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("https://loan-server-theta.vercel.app/loans");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch loans");
          setLoans([]);
          setFilteredLoans([]);
        } else {
          const loanData = Array.isArray(data) ? data : [];
          setLoans(loanData);
          setFilteredLoans(loanData);
        }
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError("Error fetching loans");
        setLoans([]);
        setFilteredLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Handle Search and Filter logic
  useEffect(() => {
    let result = loans;

    if (selectedCategory !== "All") {
      result = result.filter(
        (loan) => loan.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((loan) =>
        loan.loanTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLoans(result);
  }, [searchTerm, selectedCategory, loans]);

  // Extract unique categories for the filter dropdown
  const categories = ["All", ...new Set(loans.map((loan) => loan.category).filter(Boolean))];

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center h-screen ${theme === "dark" ? "bg-[#0A122A]" : "bg-[#F8FAFC]"} gap-4`}>
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-lg font-medium animate-pulse ${theme === "dark" ? "text-purple-400" : "text-indigo-600"}`}>
          Loading all exclusive loans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === "dark" ? "bg-[#0A122A]" : "bg-[#F8FAFC]"}`}>
        <div className={`p-6 rounded-2xl border text-center max-w-sm ${theme === "dark" ? "bg-[#111B33] border-red-500/30 text-red-400" : "bg-white border-red-200 text-red-600"} shadow-xl`}>
          <p className="text-lg font-semibold mb-2">Ops! Something went wrong</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "bg-[#0A122A]" : "bg-[#F8FAFC]"} py-16 px-4 md:px-8 min-h-screen flex flex-col items-center transition-colors duration-300`}>
      
      {/* HEADER SECTION */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm mb-4">
          All Available Financial Plans
        </h2>
        <p className={`text-sm md:text-base ${theme === "dark" ? "text-[#94A3B8]" : "text-gray-600"}`}>
          Browse through our comprehensive directory of premium lending options. Filter, search, and secure the perfect match for your requirements.
        </p>
      </div>

      {/* CONTROLS (SEARCH & FILTER) */}
      <div className={`w-11/12 lg:w-3/4 mb-12 p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center justify-between ${
        theme === "dark" ? "bg-[#111B33]/60 border-[#1E293B]" : "bg-white border-gray-100 shadow-sm"
      }`}>
        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search by loan title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              theme === "dark"
                ? "bg-[#0A122A] border-[#1E293B] text-white focus:border-purple-500"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:bg-white"
            }`}
          />
          <span className="absolute right-3 top-3 opacity-40 text-sm">🔍</span>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-1/3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#0A122A] border-[#1E293B] text-white focus:border-purple-500"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500"
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className={theme === "dark" ? "bg-[#111B33]" : "bg-white"}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-11/12">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <motion.div
              key={loan._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{
                scale: 1.04,
                boxShadow:
                  theme === "dark"
                    ? "0 25px 50px -12px rgba(139,92,246,0.25)"
                    : "0 20px 35px -10px rgba(99,102,241,0.15)",
              }}
              className={`relative w-full rounded-3xl border overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#111B33]/80 border-[#1E293B] hover:border-purple-500/50"
                  : "bg-white border-gray-100 shadow-md hover:border-indigo-400/50"
              }`}
              onClick={() => navigate(`/loan-details/${loan._id}`)}
            >
              {/* Loan Image */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={loan?.image || loan?.loanImage || "https://i.ibb.co/L8N7pYv/placeholder.jpg"}
                  alt={loan.loanTitle}
                  className="w-full h-full object-cover"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    theme === "dark"
                      ? "from-[#111B33] via-transparent to-transparent"
                      : "from-black/10 via-transparent to-transparent"
                  }`}
                />
              </div>

              {/* Loan Info */}
              <div className="p-5 flex flex-col flex-1 justify-between relative z-10">
                <div className="mb-4">
                  <h3
                    className={`text-lg font-bold mb-3 truncate bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text hover:text-transparent transition-all duration-300 ${
                      theme === "dark" ? "text-[#E2E8F0]" : "text-[#1F2937]"
                    }`}
                  >
                    {loan.loanTitle}
                  </h3>
                  
                  <div className="space-y-1.5">
                    <p className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="font-medium opacity-75">Category:</span>
                      <span className="font-semibold">{loan.category || "N/A"}</span>
                    </p>
                    <p className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="font-medium opacity-75">Interest Rate:</span>
                      <span className="font-semibold text-emerald-500">
                        {loan?.interestRate || loan?.interest || "0"}%
                      </span>
                    </p>
                    <p className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="font-medium opacity-75">Max Limit:</span>
                      <span className="font-bold text-purple-500">
                        ${loan?.maxLimit ? Number(loan.maxLimit).toLocaleString() : "0"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/loan-details/${loan._id}`);
                  }}
                >
                  View Details
                </motion.button>
              </div>

              {/* Dark mode floating radial shapes */}
              {theme === "dark" && (
                <>
                  <motion.div
                    className="absolute top-2 left-2 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-4 right-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className={`text-lg font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              🔍 No loans match your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLoans;