type Mission = {
  title: string;
  category: string;
  progress: number;
  priority: string;
  status: string;
};

type Props = {
  mission: Mission;
  onUpdate: (mission: Mission) => void;
};

function MissionCard({ mission, onUpdate }: Props) {
  return (
    <div className="mission-card">

      <div className="mission-header">
        <div>
          <h3>{mission.title}</h3>
          <p className="category">
            {mission.category}
          </p>
        </div>

        <span className="status">
          {mission.status}
        </span>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span>{mission.progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${mission.progress}%`
            }}
          />
        </div>
      </div>

<button
  onClick={() =>
    onUpdate({
      ...mission,
      progress: Math.min(
        mission.progress + 5,
        100
      ),
    })
  }
>
  Increase Progress
</button>

      <span className="priority">
        {mission.priority} Priority
      </span>

    </div>
  );
}

export default MissionCard;