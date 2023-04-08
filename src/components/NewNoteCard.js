import React, { useState } from "react";
import styles from "../CSS/Card.module.css";
import NewNoteForm from "./NewNoteForm";

const NoteCard = ({ note, setMemory, memory }) => {
  const [showEdittingNote, setShowEdittingNote] = useState(false);

  const handleEdit = (event) => {
    event.stopPropagation();
    setShowEdittingNote(!showEdittingNote);
  };

  return (
    <>
      <p
        className={styles["note-paragraph"]}
        onClick={(event) => handleEdit(event)}
      >
        {note.note}
      </p>
      {showEdittingNote && (
        <NewNoteForm
          memory={memory}
          setMemory={setMemory}
          setShowEdittingForm={setShowEdittingNote}
          note={note}
        />
      )}
    </>
  );
};

export default NoteCard;
