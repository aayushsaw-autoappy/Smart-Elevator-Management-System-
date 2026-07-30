/* ==========================================================
   Lift.jsx
========================================================== */

const Lift = ({ lifts, floors, moveLift }) => {
  return (
    <div className="flex gap-4">
      {lifts.map((lift) => (
        <LiftCabin
          key={lift.id}
          lift={lift}
          floors={floors}
          moveLift={moveLift}
        />
      ))}
    </div>
  );
};

/* ==========================================================
   Single Lift
========================================================== */

const LiftCabin = ({ lift, floors, moveLift }) => {
  return (
    <div className="flex gap-2">

      {/* Lift Shaft */}
      <div className="relative w-16 bg-gray-700 rounded">

        {floors.map((_, index) => (
          <div
            key={index}
            className="h-16 border-b border-gray-500"
          />
        ))}

        {/* Lift */}
        <div
          className="absolute left-1 right-1 h-14 bg-blue-500 rounded flex items-center justify-center text-white font-bold transition-all duration-700"
          style={{
            bottom: `${lift.floor * 64 + 2}px`,
          }}
        >
          {lift.id + 1}
        </div>

      </div>

      {/* Inner Panel */}
      <div className="grid grid-cols-4 gap-1 w-28">

        {["G", ...Array.from({ length: 15 }, (_, i) => i + 1)].map(
          (floor, index) => (
            <button
              key={floor}
              onClick={() => moveLift(lift.id, index)}
              className="bg-[#252b39] hover:bg-[#384154] text-white rounded p-1 text-xs"
            >
              {floor}
            </button>
          )
        )}

      </div>

    </div>
  );
};

export default Lift;