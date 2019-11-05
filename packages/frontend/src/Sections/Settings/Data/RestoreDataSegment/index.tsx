import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import withRestoreOptions from "../../../../Components/Select/withRestoreOptions";
import Select from "../../../../Components/Select";

import { AppState } from "../../../../redux/store";
import { RestoreState } from "../../../../redux/restore/types";
import { performRestore } from "../../../../redux/restore/actions";
import Button from "../../../../Components/Button";

interface Props {
  restoreState: RestoreState;
  performRestore: (restorePoint: string) => Promise<void>;
}

const RestoreDataSegment = (props: Props) => {

  const [restorePoint, setRestorePoint] = useState<string | undefined>();

  const {
    restoreState,
    performRestore,
  } = props;

  useEffect(() => {
  }, []);

  const restore = async () => {
    if (restorePoint === undefined) {
      alert("You must select a restore point!");
      return;
    }

    if (restoreState.restoring) {
      alert("A backup is already being performed!");
      return;
    }
    console.log(`Performing restore to ${restorePoint}...`);
    await performRestore(restorePoint);
    console.log("Restore complete!");
    alert("Restore complete!");
  };

  const SelectWithRestoreOptions = withRestoreOptions(Select);

  return (
    <div className="row segment">
      <div className="col">
        {/* Import Header */}
        <div className="row">
          <div className="col">
            <h3>Restore data</h3>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <SelectWithRestoreOptions
              size={1}
              onChange={setRestorePoint}
              current={restorePoint}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Button
              title="Restore"
              disabled={restoreState.restoring}
              onClick={restore}
              preventDefault
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  restoreState: state.restore,
});


export const mapDispatchToProps = {
  performRestore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RestoreDataSegment);
