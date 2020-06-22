import "./style.scss";

import React, { useEffect } from "react";
import { connect } from "react-redux";

import { AppState } from "../../redux/store";

import { RestoreState } from "../../redux/restore/types";

import { SaveState } from "../../redux/save/types";
import { performSave } from "../../redux/save/actions";

import ImportDataSegment from "./Data/ImportDataSegment";
import ExportDataSegment from "./Data/ExportDataSegment";
import BackupDataSegment from "./Data/BackupDataSegment";
import RestoreDataSegment from "./Data/RestoreDataSegment";
import SaveDataSegment from "./Data/SaveDataSegment";

const Settings = () => {
  useEffect(() => {}, []);

  return (
    <>
      {/* Main content */}
      <section className="container" id="settings-section">
        {/* Data Header */}
        <div className="row">
          <div className="col">
            <h2>Data</h2>
          </div>
        </div>

        {/* Import Data */}
        <ImportDataSegment />

        {/* Export Data */}
        <ExportDataSegment />

        {/* Backup Data */}
        <BackupDataSegment />

        {/* Restore Data */}
        <RestoreDataSegment />

        {/* Save Data */}
        <SaveDataSegment />
      </section>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  saveState: state.save,
});

export const mapDispatchToProps = {
  performSave,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
