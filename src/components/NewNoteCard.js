import React, { useState } from "react";
import styles from "../CSS/Card.module.css";
import NewAddNoteForm from "./NewAddNoteForm";
import MoreOptions from "./MoreOptions";

const NoteCard = ({ note, setMemory, memory }) => {
  const [edittingNote, setEdittingNote] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleEdit = (event) => {
    event.stopPropagation();
    setEdittingNote(!edittingNote);
  };

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  }

  const handleDelete = () => {
    setShowMoreOptions(false);

    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const updatedNotes = [...newMemory.notes];
      // THIS SHOULD BE EXTRACTED INTO A MEMORY FUNCTION
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = Object.keys(note).every(key => {
          if (Array.isArray(note[key])) {
            return note[key].every(tag => item[key].includes(tag));
          }
          return item[key] === note[key];
        });
        return isMatch ? index : acc;
      }, -1);

      updatedNotes.splice(index, 1);
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }

  return (
    <>
     <div className={styles["note-contents-container"]}>
      <p
        className={styles["note-paragraph"]}
        onClick={(event) => handleEdit(event)}
      >
        {note.note}
      </p>
    <span className={styles["note-three-vertical-dots-icon"]} onClick={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;</span>

     </div>
     {showMoreOptions && <MoreOptions handleDelete={handleDelete} />}
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
