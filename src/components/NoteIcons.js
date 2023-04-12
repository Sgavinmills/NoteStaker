import formStyles from "../CSS/NewAddNoteForm.module.css";
import React from 'react';

const NoteIcons = ({note, handleTouchStart, handleAddRemoveCategoryClick, handleHighPriorityClick, handleCancelClick, displayCategories}) => {

  return (
    
        <span className={`${formStyles["icon-container"]}`}>
          <span
            className={`${formStyles["plus-icon"]} ${displayCategories ? formStyles["plus-icon_selected"] : ""}`}
            onMouseDown={(event) => {
              console.log("clicking")
              handleAddRemoveCategoryClick(event);
            }}
            onTouchStart={(event) => {
              console.log("touching")
              handleTouchStart(event, "addRemoveCategory");
            }}
          >
            &#x2295;
          </span>
          <span
            className={`${formStyles["high-priority-icon"]} ${
              note.isHighPriority
                ? formStyles["note-text-area_high_prority"]
                : ""
            }`}
            onMouseDown={(event) => {
              handleTouchStart(event, "highPriority");
            }}
            // onTouchStart={(event) => {
            //   console.log("touching")
            //   handleTouchStart(event, "highPriority");
            // }}
          >
            &#x2606;
          </span>
          <span
            className={`${formStyles["rewind-icon"]}`}
            onMouseDown={(event) => {
              handleCancelClick(event);
            }}
            onTouchStart={(event) => {
              handleTouchStart(event, "cancel");
            }}
          >
            &#x21BA;
          </span>
          <span
            className={`${formStyles["cross-icon"]}`}
            onMouseDown={(event) => {
              handleTouchStart(event, "delete");
            }}
            onTouchStart={(event) => {
              handleTouchStart(event, "delete");
            }}
          >
            &#x274C;
          </span>
        </span>
      
  );
};

export default NoteIcons;
