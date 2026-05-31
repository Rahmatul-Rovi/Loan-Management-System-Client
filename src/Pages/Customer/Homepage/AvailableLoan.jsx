import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const AvailableLoan = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
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

  useEffect(() => {
    fetch("https://loan-server-theta.vercel.app/loans")
      .then((res) => res.json())
      .then((data) => {
        setLoans(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loans:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p
          className={`text-lg font-medium animate-pulse ${theme === "dark" ? "text-purple-400" : "text-indigo-600"}`}
        >
          Loading available loans...
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-20 overflow-hidden">
      {/* PREMIUM HEADER */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
          Explore Our Exclusive Loan Plans
        </h2>
        <p
          className={`text-base md:text-lg mt-3 max-w-2xl mx-auto ${theme === "dark" ? "text-[#94A3B8]" : "text-gray-600"}`}
        >
          Select from a curated range of premium loan options tailored
          specifically to empower your financial journey.
        </p>
      </div>

      {/* PREMIUM GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loans.map((loan, index) => (
          <motion.div
            key={loan._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
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
              <img
                src={
                  loan?.image ||
                  loan?.loanImage ||
                  "https://i.ibb.co/L8N7pYv/placeholder.jpg"
                }
                alt={
                  loan?.loanTitle ||
                  loan?.title ||
                  loan?.category ||
                  "Loan Image"
                }
                className="w-full h-full object-cover"
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
                  <p
                    className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <span className="font-medium opacity-75">Category:</span>
                    <span className="font-semibold">{loan.category}</span>
                  </p>
                  <p
                    className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <span className="font-medium opacity-75">
                      Interest Rate:
                    </span>
                    <span className="font-semibold text-emerald-500">
                      {loan?.interestRate || loan?.interest || "0"}
                    </span>
                  </p>
                  <p
                    className={`text-sm flex justify-between ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <span className="font-medium opacity-75">Max Limit:</span>
                    <span className="font-bold text-purple-500">
                      ${loan?.maxLimit ? loan.maxLimit.toLocaleString() : "0"}
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

            {/* Dark mode floating shapes */}
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
        ))}
      </div>

      {/* SEE MORE BUTTON */}
      <div className="text-center mt-16">
        <button
          onClick={() => navigate("/all-loans")}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 tracking-wide transform hover:-translate-y-0.5"
        >
          See More →
        </button>
      </div>
    </div>
  );
};

export default AvailableLoan;
