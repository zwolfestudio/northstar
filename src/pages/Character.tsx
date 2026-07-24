import { useState } from "react";
import useCharacter from "../hooks/useCharacter";
import useValues from "../hooks/useValues";
import ValueCard from "../components/cards/ValueCard";
import { createId } from "../utils/id";

function Character() {
  const { character, updateCharacter } = useCharacter();
  const { items: values, addItem: addValue, updateItem: updateValue, removeItem: removeValue } =
    useValues();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(character);
  const [newValueTitle, setNewValueTitle] = useState("");

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

  const handleAddValue = () => {
    const title = newValueTitle.trim();
    if (!title) return;

    const now = new Date().toISOString();
    addValue({
      id: createId(),
      title,
      description: "",
      importance: "Supporting",
      createdAt: now,
      updatedAt: now,
    });
    setNewValueTitle("");
  };

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

        <div className="add-mission">
          <input
            className="mission-input"
            placeholder="New value title..."
            value={newValueTitle}
            onChange={(e) => setNewValueTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
          />
          <button onClick={handleAddValue}>Add Value</button>
        </div>

        <div className="page-list">
          {values.map((value) => (
            <ValueCard
              key={value.id}
              value={value}
              onUpdate={updateValue}
              onRemove={removeValue}
            />
          ))}
        </div>

        {values.length === 0 && (
          <p className="hint">No values yet. Add what matters to you above.</p>
        )}
      </section>
    </div>
  );
}

export default Character;
