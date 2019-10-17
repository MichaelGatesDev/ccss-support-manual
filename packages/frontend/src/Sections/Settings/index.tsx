import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { EnumUtils, StringUtils } from "@michaelgatesdev/common";
import {
  SpreadsheetImportMode,
  SpreadsheetType,
} from "@ccss-support-manual/models";

import NavBar from "../../Components/NavBar";
import Select from "../../Components/Select";
import FileSelect from "../../Components/FileSelect";
import Collapse from "../../Components/Collapse";
import FormInput from "../../Components/FormInput";
import withRestoreOptions from "../../Components/Select/withRestoreOptions";

import { BackupState } from "../../redux/backup/types";
import { AppState } from "../../redux/store";
import { uploadSpreadsheetToImport } from "../../redux/uploads/actions";
import { downloadSpreadsheetToImport } from "../../redux/downloads/actions";
import { performBackup } from "../../redux/backup/actions";
import { performRestore } from "../../redux/restore/actions";
import { RestoreState } from "../../redux/restore/types";
import { SaveState } from "../../redux/save/types";
import { performSave } from "../../redux/save/actions";


interface Props {
  uploadSpreadsheetToImport: (fileType: SpreadsheetType, formData: FormData) => void;
  downloadSpreadsheetToImport: (fileType: SpreadsheetType, formData: FormData) => void;

  backupState: BackupState;
  performBackup: () => Promise<void>;

  restoreState: RestoreState;
  performRestore: (restorePoint: string) => Promise<void>;

  saveState: SaveState;
  performSave: () => Promise<void>;
}

interface State {
}


const Settings = (props: Props) => {

  const [importSpreadsheetURL, setImportSpreadsheetURL] = useState<string>("");
  const [importFile, setImportFile] = useState<File | FileList | undefined>();
  const [importFileType, setImportFileType] = useState<string>();
  const [importFileMode, setImportFileMode] = useState<string>();

  const [restorePoint, setRestorePoint] = useState<string | undefined>();


  const performImport = () => {
    const { uploadSpreadsheetToImport } = props;

    if (importFile === undefined && (importSpreadsheetURL === undefined || StringUtils.isBlank(importSpreadsheetURL))) {
      alert("You must select something to import");
      return;
    }

    // if there's a URL in there, try that first
    if (!StringUtils.isBlank(importSpreadsheetURL)) {
      console.debug(`Attempting to import from ${importSpreadsheetURL} ...`);
    } else {
      if (importFile === undefined) {
        console.error("Can not import file because it is undefined!");
        return;
      }
      console.debug("Compiling form data..");
      const data = new FormData();
      data.append("file", importFile as File);

      if (importFileMode === undefined) {
        console.error("File Import Mode not specified");
        return;
      }
      data.append("importMode", `${importFileMode}`);

      if (importFileType === undefined) {
        console.error("File Import Type not specified");
        return;
      }

      const parsedFileType = EnumUtils.parse(SpreadsheetType, importFileType);
      if (parsedFileType === undefined) {
        console.error("File Import Type (parsed) is invalid");
        return;
      }

      console.debug("Beginning upload..");
      uploadSpreadsheetToImport(parsedFileType, data);
    }
  };

  // TODO implement exporting to spreadsheet
  // const performExport = () => {
  // };


  const backup = async () => {
    const { performBackup, backupState } = props;
    if (backupState.backingUp) {
      alert("A backup is already being performed!");
      return;
    }
    console.log("Performing backup...");
    await performBackup();
    console.log("Backup complete!");
    alert("Backup complete!");
  };

  const restore = async () => {
    if (restorePoint === undefined) {
      alert("You must select a restore point!");
      return;
    }

    const { performRestore, restoreState } = props;
    if (restoreState.restoring) {
      alert("A backup is already being performed!");
      return;
    }
    console.log(`Performing restore to ${restorePoint}...`);
    await performRestore(restorePoint);
    console.log("Restore complete!");
    alert("Restore complete!");
  };

  const save = async () => {
    const { performSave, saveState } = props;
    if (saveState.saving) {
      alert("A save is already being performed!");
      return;
    }
    console.log("Saving...");
    await performSave();
    console.log("Save complete!");
    alert("Save complete!");
  };


  const { backupState, restoreState, saveState } = props;

  useEffect(() => {
    // console.log("Index mount");
  }, [
    backupState,
    restoreState,
    saveState,
  ]);

  const SelectWithRestoreOptions = withRestoreOptions(Select);
  return (
    <>
      {/* Top navigation */}
      <NavBar
        title="CCSS Support Manual"
        fixed
      />
      {/* Main content */}
      <section className="container" id="settings-section">

        {/* Data Header */}
        <div className="row">
          <div className="col">
            <h2>Data</h2>
          </div>
        </div>

        {/* Import Data from Spreadsheet */}
        <div className="row segment">
          <div className="col">
            {/* Import Header */}
            <div className="row">
              <div className="col">
                <h3>Import data from spreadsheet</h3>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Collapse
                  items={[
                    {
                      title: "Google Sheets",
                      show: true,
                      content: (
                        <div className="row">
                          <div className="col">
                            <FormInput
                              value={importSpreadsheetURL}
                              placeholder="e.g. https://docs.google.com/spreadsheets/d/1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY/edit#gid=0"
                              onChange={setImportSpreadsheetURL}
                            />
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "File",
                      content: (
                        <div className="row">
                          <div className="col">
                            <h5>Spreadsheet File</h5>
                            <FileSelect
                              types={["xlsx"]}
                              onSelect={setImportFile}
                            />
                          </div>
                          <div className="col">
                            <h5>Spreadsheet Type</h5>
                            <Select
                              readonly={importFile === undefined}
                              values={EnumUtils.values(SpreadsheetType)}
                              onChange={setImportFileType}
                              current={importFileType}
                            />
                          </div>
                          <div className="col">
                            <h5>Data Import Mode</h5>
                            <Select
                              readonly={importFile === undefined}
                              values={EnumUtils.values(SpreadsheetImportMode)}
                              onChange={setImportFileMode}
                              current={importFileMode}
                            />
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
            {/* Import Button */}
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  // disabled={importing}
                  onClick={performImport}
                  className="btn btn-primary btn-block"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>


        <div id="#data">

          {/* Export Data to Spreadsheet */}
          <div className="row segment">
            <div className="col">
              <div className="row">
                <div className="col">
                  <h5>Export Data to Spreadsheet</h5>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p>This feature is not available yet</p>
                </div>
              </div>
            </div>
          </div>


          {/* Backup Data */}
          <div className="row segment">
            <div className="col">
              <div className="row">
                <div className="col">
                  <h5>Backup Data</h5>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    disabled={backupState.backingUp}
                    onClick={backup}
                    className="btn btn-primary btn-block"
                  >
                    Backup
                  </button>
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


          {/* Restore Data */}
          <div className="row segment">
            <div className="col">
              <div className="row">
                <div className="col">
                  <h5>Restore Data</h5>
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
                  <button
                    type="button"
                    disabled={restoreState.restoring}
                    onClick={restore}
                    className="btn btn-primary btn-block"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Save Data */}
          <div className="row segment">
            <div className="col">
              <h5>Save Data</h5>
              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    disabled={saveState.saving}
                    onClick={save}
                    className="btn btn-primary btn-block"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  backupState: state.backup,
  restoreState: state.restore,
  saveState: state.save,
});

export const mapDispatchToProps = {
  uploadSpreadsheetToImport,
  downloadSpreadsheetToImport,
  performBackup,
  performRestore,
  performSave,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
