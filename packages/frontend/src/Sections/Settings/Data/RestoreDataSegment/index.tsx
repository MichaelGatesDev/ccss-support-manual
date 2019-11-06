import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import withRestoreOptions from "../../../../Components/Select/withRestoreOptions";
import Select from "../../../../Components/Select";

import { AppState } from "../../../../redux/store";
import { RestoreState } from "../../../../redux/restore/types";
import { performRestore } from "../../../../redux/restore/actions";
import Button from "../../../../Components/Button";
import { SettingsSegment } from "../../SettingsSegment";
import { NamedRow } from "../../../../Components/NamedRow";

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
    <SettingsSegment
      segmentTitle="Restore Data"
      segmentContent={(
        <>
          {/* Backup File Name */}
          <NamedRow
            headerType={4}
            columns={[
              {
                title: "Restore Point",
                content: (
                  <>
                    {/* Error messages row */}
                    {
                      restoreState !== undefined && restoreState.error &&
                      (
                        <div className="row">
                          <div className="col">
                            <div className="alert alert-danger" role="alert">
                              {restoreState.error}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    {/* Options */}
                    <SelectWithRestoreOptions
                      size={1}
                      onChange={setRestorePoint}
                      current={restorePoint}
                    />
                  </>
                ),
              },
            ]}
          />

          {/* Button */}
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
          {/* Progress Bar */}
          {
            restoreState.restoring &&
            (
              <div className="row">
                <div className="col">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      aria-valuenow={100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            )
          }
        </>
      )}
    />
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
