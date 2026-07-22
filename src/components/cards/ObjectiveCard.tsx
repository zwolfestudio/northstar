type Objective = {
  title: string;
  mission: string;
  progress: number;
  status: string;
};

type Props = {
  objective: Objective;
};

function ObjectiveCard({ objective }: Props) {
  return (
    <div className="objective-card">

      <h3>{objective.title}</h3>

      <p className="category">
        {objective.mission}
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${objective.progress}%`
          }}
        />
      </div>

      <div className="objective-footer">
        <span>
          {objective.progress}%
        </span>

        <span>
          {objective.status}
        </span>
      </div>

    </div>
  );
}

export default ObjectiveCard;