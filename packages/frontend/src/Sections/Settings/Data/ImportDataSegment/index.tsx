import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StringUtils, EnumUtils, Logger } from "@michaelgatesdev/common";

import { SpreadsheetType, SpreadsheetImportMode } from "@ccss-support-manual/models";

import { ImportState } from "../../../../redux/import/types";
import { importSpreadsheet } from "../../../../redux/import/actions";
import FormInput from "../../../../Components/FormInput";
import FileSelect from "../../../../Components/FileSelect";
import Select from "../../../../Components/Select";
import Button from "../../../../Components/Button";
import { AppState } from "../../../../redux/store";
import { SettingsSegment } from "../../SettingsSegment";
import { Collapse, CollapseCard } from "../../../../Components/Collapse";

interface Props {
  importState?: ImportState;
  importSpreadsheet?: (formData: FormData) => Promise<void>;
}

const ImportDataSegment = (props: Props) => {

  const [importURL, setImportSpreadsheetURL] = useState<string>("");
  const [importFile, setImportFile] = useState<File | FileList | undefined>();
  const [importFileType, setImportFileType] = useState<string | undefined>(SpreadsheetType[SpreadsheetType.ClassroomChecks]);
  const [importFileMode, setImportFileMode] = useState<string | undefined>(SpreadsheetImportMode[SpreadsheetImportMode.ClearAndWrite]);

  const {
    importState,
    importSpreadsheet,
  } = props;

  useEffect(() => {
  }, []);

  if (importState === undefined) {
    return <p>Waiting for import state..</p>; // TODO splash screen
  }

  const resetImportForm = () => {
    setImportSpreadsheetURL("");
    setImportFile(undefined);
    setImportFileType(SpreadsheetType[SpreadsheetType.ClassroomChecks]);
    setImportFileMode(SpreadsheetImportMode[SpreadsheetImportMode.ClearAndWrite]);
  };

  const performImport = async () => {
    if (importSpreadsheet === undefined) {
      Logger.error("importSpreadsheet function is undefined");
      return;
    }

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


  return (
    <SettingsSegment
      id="import-data"
      title="Import Data"
    >
      <>
        {/* Error messages row */}
        {
          importState !== undefined && importState.error &&
          (
            <div className="row">
              <div className="col">
                <div className="alert alert-danger" role="alert">
                  {importState.error}
                </div>
              </div>
            </div>
          )
        }


        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="google-sheets-tab" data-toggle="tab" href="#google-sheets" role="tab" aria-controls="google-sheets" aria-selected="true">Google Sheets</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="spreadsheet-file-tab" data-toggle="tab" href="#spreadsheet-file" role="tab" aria-controls="spreadsheet file" aria-selected="false">Spreadsheet File</a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          {/* -- START TAB CONTENT -- */}
          {/* Google Sheets */}
          <div className="tab-pane fade show active" id="google-sheets" role="tabpanel" aria-labelledby="google-sheets-tab">
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
          </div>
          {/* File */}
          <div className="tab-pane fade" id="spreadsheet-file" role="tabpanel" aria-labelledby="speadsheet-file-tab">
            {/* Header row */}
            <div className="row">
              <div className="col">
                <h5>Spreadsheet File</h5>
              </div>
            </div>
            {/* Input Row */}
            <div className="row">
              <div className="col">
                <FileSelect
                  types={["xlsx"]}
                  onSelect={setImportFile}
                />
              </div>
            </div>
          </div>
          {/* -- END TAB CONTENT */}

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
              <Button
                disabled={(importState !== undefined && importState.importing)}
                onClick={performImport}
                preventDefault
              >
                <span>Import</span>
              </Button>
            </div>
          </div>
          {
            importState.importing &&
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

      </>
    </SettingsSegment>
  );
};

const mapStateToProps = (state: AppState) => ({
  importState: state.import,
});

export const mapDispatchToProps = {
  importSpreadsheet,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportDataSegment);
