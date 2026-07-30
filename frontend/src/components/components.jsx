import { ChevronUp, ChevronDown } from "lucide-react";
// import Lift from "./Lift";

const FloorPanel = ({ lifts, callLift, moveLift }) => {
  // 15 -> G
  const floors = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div className="bg-[#181d27] border border-gray-700 rounded-xl p-5">
      <h2 className="text-xl font-bold text-white">
        Smart Elevator System
      </h2>

      <p className="text-gray-400 mb-6">
        4 Lifts • 16 Floors
      </p>

      <div className="flex gap-6">

        {/* Floor Numbers */}
        <div className="flex flex-col">
          {floors.map((floor) => (
            <FloorNumber
              key={floor}
              floor={floor}
            />
          ))}
        </div>

        {/* Lift Area
        <Lift
          lifts={lifts}
          moveLift={moveLift}
        /> */}

        {/* Call Buttons */}
        <div className="flex flex-col">
          {floors.map((floor) => (
            <CallButtons
              key={floor}
              floor={floor}
              callLift={callLift}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

/* ====================================================== */

const FloorNumber = ({ floor }) => {
  return (
    <div className="h-14 w-10 flex items-center justify-center text-white font-semibold">
      {floor === 0 ? "G" : floor}
    </div>
  );
};

/* ====================================================== */

const CallButtons = ({ floor, callLift }) => {
  return (
    <div className="h-14 flex items-center gap-2">

      <button
        onClick={() => callLift(floor)}
        className="w-8 h-8 rounded bg-[#2d3442] hover:bg-[#3b4456] flex items-center justify-center"
      >
        <ChevronUp
          size={16}
          className="text-white"
        />
      </button>

      <button
        onClick={() => callLift(floor)}
        className="w-8 h-8 rounded bg-[#2d3442] hover:bg-[#3b4456] flex items-center justify-center"
      >
        <ChevronDown
          size={16}
          className="text-white"
        />
      </button>

    </div>
  );
};

export default FloorPanel;