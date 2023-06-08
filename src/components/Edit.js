import React from "react";
import "./Edit.css";

function Edit(props) {
  return (
    <div className="edit-part">
      <input
        type="text"
        value={props.updatedName}
        onChange={props.handleName}
      />
      <textarea value={props.updatedAbout} onChange={props.handleAbout} />
      <button onClick={props.handleSave}>Save</button>
    </div>
  );
}

export default Edit;
