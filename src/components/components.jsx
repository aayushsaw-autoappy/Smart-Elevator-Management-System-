import { ChevronUp, ChevronDown } from "lucide-react";

/* ==========================================================
   FloorPanel Component
   Parent component that renders all floors.
========================================================== */

const FloorPanel = () => {
  const floors = Array.from({ length: 16 }, (_, i) => 16 - i);

  return (
    <div className="w-70 rounded-xl bg-[#181d27] p-4 border border-gray-700">
      <h2 className="text-lg font-semibold text-white">
        Building Directory
      </h2>

      <p className="text-sm text-gray-400 mb-5">
        Live Shift — 4 lifts · 16 floors
      </p>

      <div className="space-y-2">
        {floors.map((floor) => (
          <FloorRow key={floor} floor={floor} />
        ))}
      </div>
    </div>
  );
};

/* ==========================================================
   FloorRow Component
   Displays a single floor with its number and call buttons.
========================================================== */

const FloorRow = ({ floor }) => {
  return (
    <div className="flex items-center justify-between">
      <FloorNumber floor={floor} />
      <div className="w-35 bg-white h-20">

      </div>
      <CallButtons floor={floor} />
    </div>
  );
};

/* ==========================================================
   FloorNumber Component
   Displays the floor number.
========================================================== */

const FloorNumber = ({ floor }) => {
  return (
    <span className="w-8 text-center text-gray-300 font-medium">
      {String(floor).padStart(2, "0")}
    </span>
  );
};

/* ==========================================================
   CallButtons Component
   Displays Up and Down request buttons.
========================================================== */

const CallButtons = ({ floor }) => {
  const handleRequest = (direction) => {
    console.log(`Floor ${floor} requested ${direction}`);
  };

  return (
    <div className="flex gap-2">
      {/* Up Button */}
      <button
        onClick={() => handleRequest("UP")}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#252b39] hover:bg-[#31384a] transition"
      >
        <ChevronUp size={16} className="text-gray-300" />
      </button>

      {/* Down Button */}
      <button
        onClick={() => handleRequest("DOWN")}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#252b39] hover:bg-[#31384a] transition"
      >
        <ChevronDown size={16} className="text-gray-300" />
      </button>
    </div>
  );
};

export default FloorPanel;