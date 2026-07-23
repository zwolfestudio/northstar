import type { Project } from "../../models/project";

type Props = {
  project: Project;
  missionTitle?: string;
};

function ProjectCard({ project, missionTitle }: Props) {
  return (
    <div className="objective-card">
      <h3>{project.title}</h3>

      {missionTitle && <p className="category">{missionTitle}</p>}

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${project.progress}%`,
          }}
        />
      </div>

      <div className="objective-footer">
        <span>{project.progress}%</span>
        <span>{project.status}</span>
      </div>
    </div>
  );
}

export default ProjectCard;
