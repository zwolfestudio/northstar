import { useState } from "react";
import type { Value, ValueImportance } from "../../models/value";

type Props = {
  value: Value;
  onUpdate: (id: string, updates: Partial<Value>) => void;
  onRemove: (id: string) => void;
};

const IMPORTANCE_OPTIONS: ValueImportance[] = ["Core", "Supporting"];

function ValueCard({ value, onUpdate, onRemove }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const saveEditing = () => {
    onUpdate(value.id, {
      title: draft.title,
      description: draft.description,
      importance: draft.importance,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="objective-card mission-card-editing">
        <input
          className="mission-input"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />

        <textarea
          className="mission-input"
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />

        <select
          className="mission-input"
          value={draft.importance}
          onChange={(e) => setDraft({ ...draft, importance: e.target.value as ValueImportance })}
        >
          {IMPORTANCE_OPTIONS.map((importance) => (
            <option key={importance} value={importance}>
              {importance}
            </option>
          ))}
        </select>

        <div className="mission-actions">
          <button onClick={saveEditing}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="objective-card">
      <h3>
        {value.title}
        {value.importance === "Core" && <span className="tracked-badge">★ Core</span>}
      </h3>

      <p className="note-body">{value.description}</p>

      <div className="mission-actions">
        <button onClick={startEditing}>Edit</button>
        <button onClick={() => onRemove(value.id)}>Delete</button>
      </div>
    </div>
  );
}

export default ValueCard;
