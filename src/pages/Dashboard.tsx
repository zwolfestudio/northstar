import { objectives } from "../data/objectives";
import ObjectiveCard from "../components/cards/ObjectiveCard";
import MissionCard from "../components/cards/MissionCard";
import { missions as defaultMissions } from "../data/missions";
import useLocalStorage from "../hooks/useLocalStorage";

type Mission = {
  title: string;
  category: string;
  progress: number;
  priority: string;
  status: string;
};

function Dashboard() {
  const [missions, setMissions] = useLocalStorage<Mission[]>(
    "northstar-missions",
    defaultMissions
  );

  const updateMission = (updatedMission: Mission) => {
    setMissions(
      missions.map((mission) =>
        mission.title === updatedMission.title
          ? updatedMission
          : mission
      )
    );
  };

  return (
    <div>
      <h1>Good afternoon.</h1>
      <p>Your mission briefing awaits.</p>

      <div className="dashboard-grid">

        <section className="card">
          <h2>🎯 Active Missions</h2>

          {missions.map((mission) => (
            <MissionCard
              key={mission.title}
              mission={mission}
              onUpdate={updateMission}
            />
          ))}
        </section>


        <section className="card">
          <h2>⚡ Current Objectives</h2>

          {objectives.map((objective) => (
            <ObjectiveCard
              key={objective.title}
              objective={objective}
            />
          ))}

        </section>


        <section className="card">
          <h2>📌 Today's Focus</h2>
          <p>No priorities assigned.</p>
        </section>


        <section className="card">
          <h2>🌌 Observatory</h2>
          <p>Weather and astronomy modules will appear here.</p>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;