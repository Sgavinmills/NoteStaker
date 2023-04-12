import NoteCard from "./NewNoteCard";
// import { useState, useEffect } from 'react';
import styles from "../CSS/Card.module.css";

export default function NoteList({ memory, categoryName, setMemory }) {
  return (
    <div className={styles["note-list-container"]}>
      {memory.notes
        .filter((note) => note.tags.includes(categoryName))
        .map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            setMemory={setMemory}
            memory={memory}
          />
        ))}
    </div>
  );
}
