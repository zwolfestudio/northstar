import { useState } from "react";
import useCharacter from "../hooks/useCharacter";

function Character() {
  const { character, updateCharacter } = useCharacter();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(character);

  const startEditing = () => {
    setDraft(character);
    setIsEditing(true);
  };

  const saveEditing = () => {
    updateCharacter({
      name: draft.name,
      currentChapter: draft.currentChapter,
      shortDescription: draft.shortDescription,
    });
    setIsEditing(false);
  };

  const isEmpty = !character.name && !character.currentChapter && !character.shortDescription;

  return (
    <div>
      <h1>Character</h1>
      <p>Who's using Northstar, and what matters to them.</p>

      <section className="card">
        {isEditing ? (
          <div className="mission-card-editing">
            <input
              className="mission-input"
              placeholder="Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />

            <input
              className="mission-input"
              placeholder="Current Chapter"
              value={draft.currentChapter}
              onChange={(e) => setDraft({ ...draft, currentChapter: e.target.value })}
            />

            <textarea
              className="mission-input"
              placeholder="Short description..."
              rows={3}
              value={draft.shortDescription}
              onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })}
            />

            <div className="mission-actions">
              <button onClick={saveEditing}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : isEmpty ? (
          <>
            <p className="hint">
              Northstar doesn't know who you are yet. Add your name, current chapter, and a
              short description to get started.
            </p>
            <div className="mission-actions">
              <button onClick={startEditing}>Set Up Character</button>
            </div>
          </>
        ) : (
          <>
            <h2>{character.name}</h2>
            <p className="category">Current Chapter: {character.currentChapter}</p>
            <p className="note-body">{character.shortDescription}</p>
            <div className="mission-actions">
              <button onClick={startEditing}>Edit</button>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <h2>Core Values</h2>
        <p className="hint">Values aren't set up yet — coming in the next phase.</p>
      </section>
    </div>
  );
}

export default Character;
