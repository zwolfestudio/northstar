import { useState } from "react";
import MissionCard from "../components/cards/MissionCard";
import useMissions from "../hooks/useMissions";
import useTrackedItems from "../hooks/useTrackedItems";
import { createId } from "../utils/id";

function Missions() {
  const { items: missions, addItem: addMission, updateItem: updateMission } = useMissions();
  const { tracked, trackMission } = useTrackedItems();
  const [newTitle, setNewTitle] = useState("");

  const activeMissions = missions.filter((mission) => mission.status !== "Completed");

  const handleAddMission = () => {
    const title = newTitle.trim();
    if (!title) return;

    const now = new Date().toISOString();
    addMission({
      id: createId(),
      title,
      category: "General",
      status: "Planning",
      progress: 0,
      priority: "Medium",
      createdAt: now,
      updatedAt: now,
    });
    setNewTitle("");
  };

  return (
    <div>
      <h1>Missions</h1>
      <p>Every objective you're actively advancing.</p>

      <div className="add-mission">
        <input
          className="mission-input"
          placeholder="New mission title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddMission()}
        />
        <button onClick={handleAddMission}>Add Mission</button>
      </div>

      <div className="page-list">
        {activeMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onUpdate={updateMission}
            onTrack={() => trackMission(mission.id)}
            isTracked={tracked.missionId === mission.id}
          />
        ))}
      </div>

      {activeMissions.length === 0 && (
        <p className="hint">No active missions. Add one above.</p>
      )}
    </div>
  );
}

export default Missions;
