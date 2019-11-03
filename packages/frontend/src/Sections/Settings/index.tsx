import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { EnumUtils, StringUtils } from "@michaelgatesdev/common";
import {
  SpreadsheetImportMode, SpreadsheetType,
} from "@ccss-support-manual/models";

import NavBar from "../../Components/NavBar";
import Select from "../../Components/Select";
import FileSelect from "../../Components/FileSelect";
import Collapse from "../../Components/Collapse";
import FormInput from "../../Components/FormInput";
import withRestoreOptions from "../../Components/Select/withRestoreOptions";

import { AppState } from "../../redux/store";

import { BackupState } from "../../redux/backup/types";
import { performBackup } from "../../redux/backup/actions";

import { RestoreState } from "../../redux/restore/types";
import { performRestore } from "../../redux/restore/actions";

import { SaveState } from "../../redux/save/types";
import { performSave } from "../../redux/save/actions";

import { ImportState } from "../../redux/import/types";
import { importSpreadsheet } from "../../redux/import/actions";


interface Props {
  backupState: BackupState;
  performBackup: () => Promise<void>;

  restoreState: RestoreState;
  performRestore: (restorePoint: string) => Promise<void>;

  saveState: SaveState;
  performSave: () => Promise<void>;

  importState: ImportState;
  importSpreadsheet: (formData: FormData) => Promise<void>;
}

const Settings = (props: Props) => {

  const [importURL, setImportSpreadsheetURL] = useState<string>("");
  const [importFile, setImportFile] = useState<File | FileList | undefined>();
  const [importFileType, setImportFileType] = useState<string | undefined>(SpreadsheetType[SpreadsheetType.ClassroomChecks]);
  const [importFileMode, setImportFileMode] = useState<string | undefined>(SpreadsheetImportMode[SpreadsheetImportMode.ClearAndWrite]);

  const [restorePoint, setRestorePoint] = useState<string | undefined>();


  const {
    backupState,
    restoreState,
    saveState,
    importState,
  } = props;
  const {
    importSpreadsheet,
    performBackup,
    performRestore,
    performSave,
  } = props;

  useEffect(() => {
  }, []);


  const resetImportForm = () => {
    setImportSpreadsheetURL("");
    setImportFile(undefined);
    setImportFileType(SpreadsheetType[SpreadsheetType.ClassroomChecks]);
    setImportFileMode(SpreadsheetImportMode[SpreadsheetImportMode.ClearAndWrite]);
  };

  const performImport = async () => {
    const hasFile = importFile !== undefined;
    const hasURL = importURL !== undefined && !StringUtils.isBlank(importURL);
    if (!hasFile && !hasURL) {
      alert("You must select something to import");
      return;
    }

    console.debug("Compiling form data..");
    const data = new FormData();

    if (importFileMode === undefined) {
      console.error("File Import Mode not specified");
      return;
    }
    data.append("importMode", importFileMode);

    if (importFileType === undefined) {
      console.error("File Import Type not specified");
      return;
    }
    data.append("importType", importFileType);

    // if there's a URL in there, try that first
    if (hasURL) {
      console.debug(`Attempting to import from URL: ${importURL} ...`);
      data.append("url", importURL);
    }
    else {
      console.debug(`Attempting to import local file: ${(importFile as File).name} ...`);
      data.append("file", importFile as File);
    }

    try {
      await importSpreadsheet(data);
    } catch (error) {
      console.error("An error occured while attempting to import data.");
      console.log(error);
    } finally {
      resetImportForm();
    }
  };

  // TODO implement exporting to spreadsheet
  // const performExport = () => {
  // };


  const backup = async () => {
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
    if (saveState.saving) {
      alert("A save is already being performed!");
      return;
    }
    console.log("Saving...");
    await performSave();
    console.log("Save complete!");
    alert("Save complete!");
  };

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
                <h3>Import data</h3>
              </div>
            </div>

            {/* Error messages row */}
            <div className="row">
              <div className="col">
                {
                  importState.error &&
                  (
                    <div className="alert alert-danger" role="alert">
                      {importState.error}
                    </div>
                  )
                }
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
                            {/* Header row */}
                            <div className="row">
                              <div className="col">
                                <h5>Spreadsheet URL</h5>
                              </div>
                            </div>
                            {/* Input row */}
                            <div className="row">
                              <div className="col">
                                <FormInput
                                  value={importURL}
                                  placeholder="e.g. https://docs.google.com/spreadsheets/d/1EKOcnPpaXtWpE2T56OtxdFJFF29lK4dHaxLghHAkyHY/edit#gid=0"
                                  onChange={setImportSpreadsheetURL}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "File",
                      content: (

                        <div className="row">
                          <div className="col">
                            {/* Header row */}
                            <div className="row">
                              <div className="col">
                                <h5>Spreadsheet File</h5>
                              </div>
                            </div>
                            {/* Input row */}
                            <div className="row">
                              <div className="col">
                                <FileSelect
                                  types={["xlsx"]}
                                  onSelect={setImportFile}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
            {/* Spreadsheet Type */}
            <div className="row">
              <div className="col">
                <h5>Spreadsheet Type</h5>
                <Select
                  readonly={importFile === undefined && (importURL === undefined || StringUtils.isBlank(importURL))}
                  values={EnumUtils.values(SpreadsheetType)}
                  onChange={setImportFileType}
                  current={importFileType}
                />
              </div>
            </div>
            {/* Import Mode */}
            <div className="row">
              <div className="col">
                <h5>Data Import Mode</h5>
                <Select
                  readonly={importFile === undefined && (importURL === undefined || StringUtils.isBlank(importURL))}
                  values={EnumUtils.values(SpreadsheetImportMode)}
                  onChange={setImportFileMode}
                  current={importFileMode}
                />
              </div>
            </div>
            {/* Import Button */}
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  disabled={importState.importing}
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
  importState: state.import,

  backupState: state.backup,
  restoreState: state.restore,
  saveState: state.save,
});

export const mapDispatchToProps = {
  importSpreadsheet,
  performBackup,
  performRestore,
  performSave,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
