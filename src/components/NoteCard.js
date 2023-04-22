import React, { useState, useEffect, useRef } from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
import { addOrRemoveParentCategoryToNote, addOrRemoveSubCategoryToNote, deleteNoteFromMemory, getNoteIndex, getParentCategoryIndex, moveNoteDown, moveNoteUp, submitNoteChange, toggleHighPriority, toggleMarkDone } from "../memoryFunctions/memoryFunctions";
import AddRemoveCategories from "./AddRemoveCategories";
import ConfirmModal from "./ConfirmModal";
import NoteIcons from "./NoteIcons";
import MoveCategoryArrows from './MoveItemArrows'; // IF WROKS REMOVE TO JUST MOVEITEMARROWS
const NoteCard = ({ note, setMemory, memory, isFocussedCannotClick, setIsFocussedCannotClick, parentCategory, subCategoryName }) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element

  const [noteText, setNoteText] = useState(note.note);
  const [textAreaHeight, setTextAreaHeight] = useState(38);
  const [inFocus, setInFocus] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayingSubCategories, setDisplayingSubCategories] = useState(
    parentCategory.sub_categories.length > 0 ? true : false
  );
  const [subCatToDisplay, setSubCatToDisplay] = useState("");
  const [movingNote, setMovingNote] = useState(false);
  const confirmationMessage =
    "Are you sure? Note will be deleted from all categories";

  // need this one otherwise the textareas don't update when memory state changes (ie deleting an item) because
  // it doesnt directly display anything from the memory state.
  useEffect(() => {
    setNoteText(note.note);
  }, [memory, note.note]);

  useEffect(() => {
    if (textareaRef?.current) {
      setTextAreaHeight(textareaRef.current.scrollHeight);
    }
  }, [memory]);

  // focuses on the first note if it has just been put there by 'add note' and needs filling in
  useEffect(() => {
    if (note.newEmptyNote) {
      textareaRef.current.focus();
      setIsFocussedCannotClick(true);
    }
  }, [note.newEmptyNote, setIsFocussedCannotClick]);

  const handleDeleteConfirmClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsModalOpen(false);
    removeFromMemory();
  };

  const removeFromMemory = () => {
    setMemory((currMemory) => {
      const newMemory = deleteNoteFromMemory(currMemory, note.id)
      return newMemory;
    });
  };


  const handleChange = (event) => {
    setNoteText(event.target.value);
    setTextAreaHeight(textareaRef.current.scrollHeight);
  };

  const handleFocus = (event) => {
    if (event.relatedTarget?.tagName === "TEXTAREA") {
      setInFocus(false);
      textareaRef.current.blur();
    } else {
      setInFocus(true);
      setIsFocussedCannotClick(true);

    }
  };

  const handleBlur = (event) => {
    setInFocus(false);
    handleSubmit(event);
    setIsFocussedCannotClick(false);
  };

  const handleSubmit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (noteText.length === 0) {
      if (note.newEmptyNote) {
        removeFromMemory();
        return;
      }
      setNoteText(note.note);
      return;
    }

    setMemory((currMemory) => {
      const newMemory = submitNoteChange(currMemory, note.id, noteText)
      return newMemory;
    });
  };

  const updateCategoryInMemory = (event, categoryName, categoryType, parentCategoryName) => { 
    setMemory((currMemory) => {
      if (categoryType === "parent") {
        const newMemory = addOrRemoveParentCategoryToNote(currMemory, note.id, categoryName, noteText) 
        return newMemory;
       } else {
        if (categoryType === "sub") {
            if (subCategoryName === categoryName) { 
              setIsFocussedCannotClick(false);
            }
          const newMemory = addOrRemoveSubCategoryToNote(currMemory, note.id, categoryName, parentCategoryName, noteText)
          return newMemory;

        }

       }
    });
  };

  const handleAddRemoveCategoryClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDisplayCategories(!displayCategories);
  };
  
  const handleHighPriorityClick = (event) => {
    event.stopPropagation();

    setMemory((currMemory) => {
      const newMemory = toggleHighPriority(currMemory, note.id, noteText)
      return newMemory;
    });
  };

  const handleMarkDoneClick = (event) => {

    setMemory((currMemory) => {
      const newMemory = toggleMarkDone(currMemory, note.id, noteText)
      return newMemory;
    });
  };

  const handleMoveNoteClick = () => {
    setMovingNote(true);
  }

  const handleTouchStart = (event, touchType, categoryName, categoryType, parentCategory) => {
    
        switch (touchType) {
          case "addRemoveCategory":
            event.stopPropagation();
            event.preventDefault();
            handleAddRemoveCategoryClick(event);
            break;
          case "highPriority":
            event.stopPropagation();
            event.preventDefault();
            handleHighPriorityClick(event);
            break;
          case "moveNote": // rename?
          event.stopPropagation();
            handleMoveNoteClick(event);
            break;
          case "markDone":
            event.stopPropagation();
            event.preventDefault();
            handleMarkDoneClick(event);
            break;
          case "delete":
            event.stopPropagation();
            event.preventDefault();
            setIsModalOpen(true);
            break;
          case "category":
            event.stopPropagation();
            event.preventDefault();
            if (categoryType === "parent") {  
              const isCurrentlyActiveTag = note.tags.some(tag => tag.name === categoryName);
              const indexOfParentClickedOn = getParentCategoryIndex(memory.categories, categoryName);
              const hasSubCategories = memory.categories[indexOfParentClickedOn].sub_categories.length > 0 ? true : false;

              if (!isCurrentlyActiveTag && hasSubCategories) {
                setDisplayingSubCategories(true);
                setSubCatToDisplay(categoryName);
              }

              if (!isCurrentlyActiveTag && hasSubCategories) {
                break;
              }
            }
            updateCategoryInMemory(event, categoryName, categoryType, parentCategory);
            break;
          default:
            break;
        }
     
  };

  const handleMoveNoteUp = (event, noteID) => {
    event.stopPropagation();
    event.preventDefault();
  
    const noteIndex = getNoteIndex(memory.notes, noteID)
    // THIS WORKS BUT CANNOT BE EFFICIENT?!? FILTERING THE ENTIRE MEMORY AGAIN INTO CATEGORY NOTES.
    // THEN DOING ANOTHER FULL SEARCH ON THE MEMORY TO GET THE INDEX OF THE NOTEID THAT WE FIND...
    // THERE MUST BE A WAY TO RETAIN THIS INFORMATION FROM WHEN NOTELIST DOES THE FILTERS
    // BUT IT WILL DO FOR NOW. NO NEED FOR PREMMATURE OPTIMISATIONS.
    const categoryFilteredNotes = memory.notes.filter(note => {
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

    const noteIndexInFilteredCategory = getNoteIndex(categoryFilteredNotes, note.id);

    if (noteIndexInFilteredCategory === 0) {
      console.log("already at top");
      return;
    }

    const noteIDOfIndexToSwapWith = categoryFilteredNotes[noteIndexInFilteredCategory-1].id;
    const noteToSwapIndex = getNoteIndex(memory.notes, noteIDOfIndexToSwapWith);
  
    setMemory(currMemory => {
      const newMemory = moveNoteUp(currMemory, noteIndex, noteToSwapIndex);
      return newMemory;
      })
  }
  
  const handleMoveNoteDown = (event, noteID) => {
    event.stopPropagation();
    event.preventDefault();
    const noteIndex = getNoteIndex(memory.notes, noteID);
    const categoryFilteredNotes = memory.notes.filter(note => {
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

    const noteIndexInFilteredCategory = getNoteIndex(categoryFilteredNotes, note.id);
    console.log(noteIndexInFilteredCategory)
    console.log()

    if (noteIndexInFilteredCategory === categoryFilteredNotes.length -1) {
      console.log("already at bottom")
      // handle not moving here, but wait til notes is done
      return;
    }

    const noteIDOfIndexToSwapWith = categoryFilteredNotes[noteIndexInFilteredCategory+1].id;
    const noteToSwapIndex = getNoteIndex(memory.notes, noteIDOfIndexToSwapWith);

    setMemory(currMemory => {
      const newMemory = moveNoteDown(currMemory, noteIndex, noteToSwapIndex);
      return newMemory;
      })
  }

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          handleDelete={handleDeleteConfirmClick}
          setIsModalOpen={setIsModalOpen}
          confirmationMessage={confirmationMessage}
        />
      )}
      { movingNote && 
      <MoveCategoryArrows handleUp={handleMoveNoteUp} handleDown={handleMoveNoteDown} memory={memory} setMemory={setMemory} itemName={note.id} setMovingItem={setMovingNote}/>
    }
      <div className={styles["note-contents-container"]}>
        <div className={`${formStyles["textarea-container"]}`}>
          <textarea
            ref={textareaRef}
            style={{ height: `${textAreaHeight}px` }}
            className={`${formStyles["note-text-area"]} ${
              note.priority === "high"
                ? formStyles["note-text-area_high_priority"]
                : note.priority === "low" ? formStyles["note-text-area_low_priority"]
                : ""
            }`}
            placeholder="Enter note text here"
            value={noteText}
            onFocus={(event) => {
              handleFocus(event);
            }}
            onBlur={(event) => {
              handleBlur(event);
            }}
            onChange={(event) => {
              handleChange(event);
            }}
          />{" "}
          {inFocus && (
            <NoteIcons
              displayCategories={displayCategories}
              note={note}
              handleTouchStart={handleTouchStart}
            />
          )}
        </div>
        <div className={styles["dots-and-tick-container"]}>
          {note.markDone ? (
            <span
              className={`${styles["done-tick"]}`}
              onMouseDown={(event) => {
                handleTouchStart(event, "markDone");
              }}
            >
              &#x2705;
            </span>
          ) : (
            <span
              className={`${styles["not-done-tick"]}`}
              onMouseDown={(event) => {
                handleTouchStart(event, "markDone");
              }}
            >
              &#x26AA;
            </span>
          )}
          <span
            className={styles["note-three-vertical-dots-icon"]}
            onClick={(event) => {}}
          >
            &#x22EE;
            {/* {showMoreOptions && <MoreOptions options={options} />} */}
          </span>
        </div>
      </div>

      {displayCategories && inFocus && (
        <AddRemoveCategories
          memory={memory}
          note={note}
          handleTouchStart={handleTouchStart}
          subCategoryName={subCategoryName}
          parentCategory={parentCategory}
          displayingSubCategories={displayingSubCategories}
          setDisplayingSubCategories={setDisplayingSubCategories}
          setSubCatToDisplay={setSubCatToDisplay}
          subCatToDisplay={subCatToDisplay}
        />
      )}
    </>
  );
};

export default NoteCard;
