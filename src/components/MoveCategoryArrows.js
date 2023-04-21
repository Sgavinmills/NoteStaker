import React, { useState } from 'react';
import MoveArrowStyles from "../CSS/MoveArrow.module.css";

const EditCategoryModal = ({ setMemory, category, setMovingCategory, memory, handleUp, handleDown}) => {
  const [catName, ] = useState(category.name)

  const handleDone = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMovingCategory(false);
  }

  return (
    <div className={`${MoveArrowStyles["arrow-modal-container"]}`}>
     <div className={`${MoveArrowStyles["arrow-container"]}`}>
      
        <div className={`${MoveArrowStyles["up-arrow"]}`} onClick={(event) => {handleUp(event, catName)}}></div>
        <div className={`${MoveArrowStyles["done"]}`} onClick={(event) => {handleDone(event)}}></div>
        <div className={`${MoveArrowStyles["down-arrow"]}`} onClick={(event) => {handleDown(event, catName)}}></div>

     </div>
    </div>

  );
};

export default EditCategoryModal;
