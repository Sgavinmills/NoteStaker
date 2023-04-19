import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";

const EditCategoryModal = ({setEdittingCategory, currCategoryName, setMemory, memory, subCategoryName, parentCategory}) => {
const [categoryText, setCategoryText] = useState(currCategoryName);

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setEdittingCategory(false);

  // ALMOST THERE BUT ATM EDITTING CATEGORY NAME WORKS BUT DOESNT UPDATE IT ON EVERY NOTE :( )
  // THEN WILL HAVE TO GO DO ADD CATEGORY ETC ETC. 
  if (subCategoryName) {
    console.log("sanity check")
    setMemory(currMemory => {
      const newMemory = {...currMemory}
      const newNotes = [...newMemory.notes];
      const newCategories = [...newMemory.categories];

      const catIndex = newCategories.reduce((acc, category, index) => {
        const isMatch = category.name === parentCategory.name;
        return isMatch ? index : acc;
      }, -1);

      const subCatIndex = newCategories[catIndex].sub_categories.reduce((acc, subCategory, index) => {
        const isMatch = subCategory === subCategoryName;
        return isMatch ? index : acc;
      }, -1)

      const newSubCategories = [...newCategories[catIndex].sub_categories];
      newSubCategories[subCatIndex] = categoryText;

      newCategories[catIndex].sub_categories = newSubCategories;


      newMemory.categories = newCategories;


      // const notesWithParentCategory = newNotes.filter(note => note.tags.some(tag => tag.name === parentCategory));

      const filteredNotes = [];

      newNotes.forEach(note => {
        // check if the tags array contains a cat object with the name === parentCategory. 
        // if it does not can just push striahgt into filteredNotes and move on.

        // but if it does have name === parentCategory, then using the index already established, 
        // access that object and see if sub_tags contains subCategoryName.
        // if it does splice it out then push unless it is the only sub category in which case just forget about him
        // if not then just push 

        const catIndex = note.tags.reduce((acc, category, index) => {
          const isMatch = category.name === parentCategory;
          return isMatch ? index : acc;
        }, -1)

        if (catIndex === -1) {
          filteredNotes.push(note);
        } else {
          const subCatIndex = note.tags[catIndex].sub_tags.includes(subCategoryName);
          if (subCatIndex === -1) {
            filteredNotes.push(note);
          } else {
              note.tags[catIndex].sub_tags[subCatIndex] = categoryText;
              // make this new obj first.
              const newNoteSubTags = [...note.tags[catIndex].sub_tags];
              note.tags[catIndex].sub_tags = newNoteSubTags;
              filteredNotes.push(note);
            
          }
        }
      })

      
      newMemory.notes = filteredNotes;
      return newMemory;

     })



  } else {
    console.log("otehr sanity check")
    if (!memory.categories.some(category => category.name === categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        const newCategories = [...newMemory.categories];
        // const catIndex = newCategories.indexOf(currCategoryName);

        const catIndex = newCategories.reduce((acc, category, index) => {
          const isMatch = category.name === currCategoryName;
          return isMatch ? index : acc;
        }, -1);

        newCategories[catIndex].name = categoryText;
        newMemory.categories = newCategories;
  
        // loop over notes
        // if note.tag contains currcategoryname then change it
  
        const newNotes = [...newMemory.notes];
        const updatedNotes = newNotes.map(note => {
          // const tagIndex = note.tags.indexOf(currCategoryName);

          const tagIndex = note.tags.reduce((acc, tag, index) => {
            const isMatch = tag.name === currCategoryName;
            return isMatch ? index : acc;
          }, -1);

          if (tagIndex > -1) {
            note.tags[tagIndex].name = categoryText;
          }
  
          return note;
        })
  
        newMemory.notes = updatedNotes;
        return newMemory;
      })
    } else {
      alert("already a category with that name, sos");
    }

  }
}

const handleCancel = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setEdittingCategory(false);
}
  return (
    <div className={`${ModalStyles["add-category-modal-container"]} ${ModalStyles[""]}`}>
     <div className={`${ModalStyles["add-category-modal-content"]}`}>
      <div className={`${ModalStyles["add-category-modal-message"]}`}>
        <p>Enter category name</p>
          
        <input onChange={(event) => setCategoryText(event.target.value)}
          value={categoryText}
        
        />
      </div>
      <div className={`${ModalStyles["add-category-modal-options"]}`}>
        <button className={`${ModalStyles["add-category-modal-option"]}`} onClick={(event) => {handleSubmit(event)}}>Submit</button>
        <button className={`${ModalStyles["add-category-modal-option"]}`} onClick={(event) => {handleCancel(event)}}>Cancel</button>
    </div>

     </div>
    </div>
  );
};

export default EditCategoryModal;
