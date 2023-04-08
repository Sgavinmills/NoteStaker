import React from 'react';
import OptionStyles from "../CSS/OptionsModal.module.css";

const MoreOptions = ({handleDelete}) => {

  return (
    <div className={`${OptionStyles["options-container"]} ${OptionStyles[""]}`}>
      <p className={OptionStyles["option-text"]} onClick={(() => {handleDelete()})}>Delete item</p>
      <p className={OptionStyles["option-text"]}>Add / remove categories</p>
      <p className={OptionStyles["option-text"]}>View additional details</p>
    </div>
  );
};

export default MoreOptions;
