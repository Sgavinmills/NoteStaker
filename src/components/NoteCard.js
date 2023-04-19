import React, { useState, useEffect, useRef } from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
import AddRemoveCategories from "./AddRemoveCategories";
import ConfirmModal from "./ConfirmModal";
import NoteIcons from "./NoteIcons";

const NoteCard = ({ note, setMemory, memory, isFocussedCannotClick, setIsFocussedCannotClick, parentCategory, subCategoryName }) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element

  const [noteText, setNoteText] = useState(note.note);
  const [textAreaHeight, setTextAreaHeight] = useState(38);
  const [inFocus, setInFocus] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayingSubCategories, setDisplayingSubCategories] = useState(
    true
  );
  const [subCatToDisplay, setSubCatToDisplay] = useState("");
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
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes.splice(index, 1);
      newMemory.notes = updatedNotes;
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
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);
      updatedNotes[index].note = noteText;
      updatedNotes[index].newEmptyNote = false; // or delete property?
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const updateCategoryInMemory = (event, category, categoryType, parentCategory) => { // can prob not need categorytype and just check for parentcategory, but whatevs for now
    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      const currCategories = updatedNotes[index].tags;
      const newCategories = [...currCategories];

      // const catIndex = newCategories.indexOf(category);
      if (categoryType === "parent") {
        let catIndex = -1;
        for (let i = 0; i < newCategories.length; i++) {
          if (newCategories[i].name === category) {
            catIndex = i;
            break;
          }
        }
        if (catIndex > -1) {
          newCategories.splice(catIndex, 1);
        } else {
          newCategories.push({"name" : category, "sub_tags" : []})
        }
       } else {
        if (categoryType === "sub") {
         
          let parentCatIndex = -1;
          console.log(parentCategory)
          for (let i = 0; i < newCategories.length; i++) {
            if (newCategories[i].name === parentCategory.name) {
              parentCatIndex = i;
              break;
            }
          }
          const subCatIndex = newCategories[parentCatIndex].sub_tags.indexOf(category)
          if (subCatIndex > -1) {
            if (subCategoryName === newCategories[parentCatIndex].sub_tags[subCatIndex]) {
              setIsFocussedCannotClick(false);
            }
            newCategories[parentCatIndex].sub_tags.splice(subCatIndex,1)
          } else {
            newCategories[parentCatIndex].sub_tags.push(category);
            if (newCategories[parentCatIndex].sub_tags.length === 1) {
              setIsFocussedCannotClick(false);
            }
          }
        }
       }


      

      updatedNotes[index].tags = newCategories;
      updatedNotes[index].note = noteText;
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  // saving for later, probably wants revamped. Maybe actually store a 'previousedit' variable? or multiple?
  const handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // add implementation here.
    // will need to add a 'noteHistory' property to the note
    // click can then read and update memory accordingly
    // obvs will need to go through and ensure noteHistory is updated whenever the note is updated
  };

  const handleAddRemoveCategoryClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDisplayCategories(!displayCategories);
  };
  
  const handleHighPriorityClick = (event) => {
    event.stopPropagation();

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      // updatedNotes[index].isHighPriority = !updatedNotes[index].isHighPriority;
      if (updatedNotes[index].priority === "high") {
        updatedNotes[index].priority = "low" 
      } else if (updatedNotes[index].priority === "low") {
        updatedNotes[index].priority = "" 
      } else {
        updatedNotes[index].priority = "high" 
      }

      updatedNotes[index].note = noteText;
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const handleMarkDoneClick = (event) => {

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].markDone = !updatedNotes[index].markDone;
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const handleTouchStart = (event, touchType, categoryName, categoryType, parentCategory) => {
    event.stopPropagation();
    event.preventDefault();
        switch (touchType) {
          case "addRemoveCategory":
            handleAddRemoveCategoryClick(event);
            break;
          case "highPriority":
            handleHighPriorityClick(event);
            break;
          case "cancel":
            handleCancelClick(event);
            break;
          case "markDone":
            handleMarkDoneClick(event);
            break;
          case "delete":
            setIsModalOpen(true);
            break;
          case "category":
            if (!displayingSubCategories) {
              // if we're on parent atm, want to swap to the sub categories when we select the parent
              // but only if that parent is now chosen... if the parent has been deselected then stay on parents
              
              // fundamentally need to check the notes categories and see if it contains
              // the categoryname clicked on (in the parent categories)
              // if it does NOT then we know it will from now on
              // so we will do the setdisplayingsubcategories(true)
              // and also need to update a state which tells the addremovecategoris component
              // which subs its actually showing :/ 

              if (!note.tags.some(tag => tag.name === categoryName)) {
                setDisplayingSubCategories(true);
                setSubCatToDisplay(categoryName);

              }
            }
            updateCategoryInMemory(event, categoryName, categoryType, parentCategory);
            break;
          default:
            break;
        }
     
  };

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          handleDelete={handleDeleteConfirmClick}
          setIsModalOpen={setIsModalOpen}
          confirmationMessage={confirmationMessage}
        />
      )}
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
