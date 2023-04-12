import formStyles from "../CSS/NewAddNoteForm.module.css";
import React from 'react';

const AddRemoveCategories = ({memory, note, handleTouchStart}) => {

  return (
    <div className={formStyles["categories-container"]}>
          {memory.categories.map((category) => (
            <div
              key={category}
              className={`${formStyles["category-tab"]} ${
                note.tags.includes(category) ? formStyles["selected"] : ""
              }`}
              onMouseDown={(event) => handleTouchStart(event, "category", category)}
              // onTouchStart={(event) =>
              //   handleTouchStart(event, "category", category)
              // }
            >
              {category}
            </div>
          ))}
        </div>
       
            
  );
};

export default AddRemoveCategories;
