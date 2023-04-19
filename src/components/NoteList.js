import NoteCard from "./NoteCard";
import styles from "../CSS/Card.module.css";

export default function NoteList({ memory, subCategoryName, parentCategory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) {

  // notelist is called from categorycard and subcategorycard
  // in both cases it is given the parentCategory
  // but if its from the categoryCard it will not have a subCategoryName provided...
  //in this instance we only want to render the ntote (ie included in the filter function) if
  // ... the note does not have any sub tags in the category we are in.

  // if we are a subcategory note, then it 
  return (
    <div className={styles["note-list-container"]}>
      {memory.notes
        .filter((note) => {
              for(let i = 0; i < note.tags.length; i++) {
                if (note.tags[i].name === parentCategory.name) {
                  if (!subCategoryName && note.tags[i].sub_tags.length === 0) {
                    return note;
                  } else {
                    if (subCategoryName) {
                       if (note.tags[i].sub_tags.includes(subCategoryName)) {
                         return note;
                       }
                    }
                  }
         
                  break;
                }
              }
              return false;
        })
        .map((note) => (
          <NoteCard
           isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick}
            key={note.id}
            note={note}
            setMemory={setMemory}
            memory={memory}
            parentCategory={parentCategory}
            subCategoryName={subCategoryName}
          />
        ))}
    </div>
  );
}
