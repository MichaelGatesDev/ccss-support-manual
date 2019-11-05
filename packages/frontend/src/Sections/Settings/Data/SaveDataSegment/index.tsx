import "./style.scss";

import React, { useEffect } from "react";
import { connect } from "react-redux";

import { AppState } from "../../../../redux/store";
import { performSave } from "../../../../redux/save/actions";
import { SaveState } from "../../../../redux/save/types";
import Button from "../../../../Components/Button";

interface Props {
  saveState: SaveState;
  performSave: () => Promise<void>;
}

const SaveDataSegment = (props: Props) => {

  const {
    saveState,
    performSave,
  } = props;

  useEffect(() => {
  }, []);

  const save = async () => {
    if (saveState.saving) {
      alert("A save is already being performed!");
      return;
    }
    console.log("Saving...");
    await performSave();
    console.log("Save complete!");
    alert("Save complete!");
  };

  return (
    <div className="row segment">
      <div className="col">
        {/* Import Header */}
        <div className="row">
          <div className="col">
            <h3>Save data</h3>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Button
              title="Restore"
              disabled={saveState.saving}
              onClick={save}
              preventDefault
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  saveState: state.save,
});


export const mapDispatchToProps = {
  performSave,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveDataSegment);
