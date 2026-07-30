import { useState } from "react";
import FloorPanel from "./components/components";

function App() {
  // 4 lifts
  const [lifts, setLifts] = useState([
    { id: 0, floor: 0 },
    { id: 1, floor: 0 },
    { id: 2, floor: 0 },
    { id: 3, floor: 0 },
  ]);

  // Floor labels
  const floorLabels = [
    "G",
    ...Array.from({ length: 15 }, (_, i) => i + 1),
  ];

  // Move lift from inside panel
  const moveLift = (liftId, floor) => {
    setLifts((prev) =>
      prev.map((lift) =>
        lift.id === liftId ? { ...lift, floor } : lift
      )
    );
  };

  // Call lift from floor button
  const callLift = (floorLabel) => {
    const targetFloor = floorLabels.indexOf(floorLabel);

    // Find nearest lift
    let nearestLift = lifts[0];
    let minDistance = Math.abs(lifts[0].floor - targetFloor);

    lifts.forEach((lift) => {
      const distance = Math.abs(lift.floor - targetFloor);

      if (distance < minDistance) {
        minDistance = distance;
        nearestLift = lift;
      }
    });

    moveLift(nearestLift.id, targetFloor);
  };

  return (
    <div className="min-h-screen bg-[#10141d] flex justify-center items-center p-5">
      <FloorPanel
        lifts={lifts}
        callLift={callLift}
        moveLift={moveLift}
      />
    </div>
  );
}

export default App;