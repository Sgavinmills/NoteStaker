import NoteCard from "./NoteCard";
import styles from "../CSS/Card.module.css";

export default function NoteList({ memory, categoryName, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) {
  return (
    <div className={styles["note-list-container"]}>
      {memory.notes
        .filter((note) => note.tags.includes(categoryName))
        .map((note) => (
          <NoteCard
           isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick}
            key={note.id}
            note={note}
            setMemory={setMemory}
            memory={memory}
          />
        ))}
    </div>
  );
}
