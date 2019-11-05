import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Logger } from "@michaelgatesdev/common";

import { BackupOptions } from "@ccss-support-manual/models";

import { AppState } from "../../../../redux/store";
import { BackupState } from "../../../../redux/backup/types";
import { performBackup } from "../../../../redux/backup/actions";
import Button from "../../../../Components/Button";

interface Props {
  backupState: BackupState;
  performBackup: (options: BackupOptions) => Promise<void>;
}

const BackupDataSegment = (props: Props) => {

  const {
    backupState,
    performBackup,
  } = props;

  if (backupState === undefined) {
    return <p>Waiting for backup state..</p>; // TODO splash screen
  }

  useEffect(() => {
  }, []);

  const backup = async () => {
    if (performBackup === undefined) {
      Logger.error("performBcakup function is undefined");
      return;
    }

    if (backupState.backingUp) {
      alert("A backup is already being performed!");
      return;
    }
    console.log("Performing backup...");
    await performBackup({
      name: "",
    });
    console.log("Backup complete!");
    alert("Backup complete!");
  };

  return (
    <div className="row segment">
      <div className="col">
        {/* Import Header */}
        <div className="row">
          <div className="col">
            <h3>Backup data</h3>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Button
              title="Backup"
              disabled={backupState.backingUp}
              onClick={backup}
              preventDefault
            />
          </div>
        </div>
        {
          backupState.backingUp &&
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
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  backupState: state.backup,
});


export const mapDispatchToProps = {
  performBackup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackupDataSegment);
