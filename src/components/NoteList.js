// import NoteCard from './NoteCard'
import NewNoteCard from './NewNoteCard'
import { useState, useEffect } from 'react';
import styles from "../CSS/Card.module.css";

export default function NoteList({memory, categoryName, setMemory}) {

  const [notesToList, setNotesToList] = useState([]);
  useEffect(() => {
    setNotesToList(() => {
      const notes = memory.notes.filter(note => {
        if (note.tags?.includes(categoryName)) {
          return note;
        }
        return false;
      })
      return notes;
    })
  }, [memory, categoryName])


  
  return (
    <div className={styles["note-list-container"]} >
          {notesToList?.map((note, index) => (
            <NewNoteCard key={index} note={note} index={index} setMemory={setMemory} memory={memory}/>
            // <NoteCard key={index} note={note} index={index} setMemory={setMemory} memory={memory}/>
          ))}
    </div>
  )
}
