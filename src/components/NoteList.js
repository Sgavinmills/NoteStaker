import NoteCard from './NoteCard'
import styles from "../CSS/Card.module.css";
import { useState, useEffect } from 'react';

export default function NoteList({memory, categoryName}) {

  const [notesToList, setNotesToList] = useState([]);
  useEffect(() => {
    setNotesToList(() => {
      const notes = Object.values(memory).filter(note => {
        console.log(note.tags);
        console.log(categoryName);
        if (note.tags?.includes(categoryName)) {
          return note;
        }
      })
      console.log(notes);
      return notes;
    })
  }, [memory, categoryName])
  
  return (
    <div>
          {notesToList?.map((note, index) => (
            <NoteCard mainText={notesToList[index]} additionalText={note.additional_info}/>
          ))}
    </div>
  )
}
