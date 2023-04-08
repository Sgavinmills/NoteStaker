import React, { useState } from "react";
import styles from "../CSS/Card.module.css";
import NewAddNoteForm from "./NewAddNoteForm";

const NoteCard = ({ note, setMemory, memory }) => {
  const [edittingNote, setEdittingNote] = useState(false);

  const handleEdit = (event) => {
    event.stopPropagation();
    setEdittingNote(!edittingNote);
  };

  return (
    <>
      <p
        className={styles["note-paragraph"]}
        onClick={(event) => handleEdit(event)}
      >
        {note.note}
      </p>
      {edittingNote && (
        <NewAddNoteForm
          memory={memory}
          setMemory={setMemory}
          setEdittingForm={setEdittingNote}
          noteToEdit={note}
        />
      )}
    </>
  );
};

export default NoteCard;
