import React, { useState } from 'react';
import MoveArrowStyles from "../CSS/MoveArrow.module.css";

const MoveItemArrows = ({ itemName, setMovingItem, memory, handleUp, handleDown}) => {
  const [catName, ] = useState(itemName)

  const handleDone = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMovingItem(false);
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

export default MoveItemArrows;
