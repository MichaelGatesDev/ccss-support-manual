import "./style.scss";

import React, { useEffect } from "react";
import { connect } from "react-redux";

import { AppState } from "../../../../redux/store";
import { performSave } from "../../../../redux/save/actions";
import { SaveState } from "../../../../redux/save/types";
import Button, { ButtonType } from "../../../../Components/Button";
import { SettingsSegment } from "../../SettingsSegment";

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
    <SettingsSegment
      id="save-data"
      title="Save Data"
    >
      <>
        <div className="row">
          <div className="col">
            <Button
              buttonType={ButtonType.Secondary}
              disabled={saveState.saving}
              onClick={save}
              preventDefault
            >
              <span>Save</span>
            </Button>
          </div>
        </div>
      </>
    </SettingsSegment>
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
