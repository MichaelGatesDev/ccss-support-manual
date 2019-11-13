import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StringUtils, EnumUtils, Logger } from "@michaelgatesdev/common";

import { SpreadsheetType, SpreadsheetImportMode } from "@ccss-support-manual/models";

import { ImportState } from "../../../../redux/import/types";
import { importSpreadsheet } from "../../../../redux/import/actions";
import Collapse from "../../../../Components/Collapse";
import FormInput from "../../../../Components/FormInput";
import FileSelect from "../../../../Components/FileSelect";
import Select from "../../../../Components/Select";
import Button from "../../../../Components/Button";
import { AppState } from "../../../../redux/store";
import { SettingsSegment } from "../../SettingsSegment";

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
      segmentTitle="Import Data"
      segmentContent={(
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
        </>
      )}
    />
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
