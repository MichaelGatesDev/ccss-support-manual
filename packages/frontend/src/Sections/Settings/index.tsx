import "./style.scss";

import React, { PureComponent, Fragment, ChangeEvent } from "react";
import { EnumUtils } from "@michaelgatesdev/common";
import {
  SpreadsheetImportMode,
  SpreadsheetType,
  ClassroomChecksSpreadsheetVersion,
  TroubleshootingSpreadsheetVersion,
} from "@ccss-support-manual/models";
import { SpreadsheetUtils } from "@ccss-support-manual/utilities";

import NavBar from "../../Components/NavBar";
import Select from "../../Components/Select";
import FileSelect from "../../Components/FileSelect";

interface Props {

}

interface State {

  uploading: boolean;

  file?: File;
  fileType: SpreadsheetType;
  fileVersion?: ClassroomChecksSpreadsheetVersion | TroubleshootingSpreadsheetVersion;
  importMode: SpreadsheetImportMode;

  selectedRestorePoint?: string;
  restoreOptions?: string[];
}

export default class Settings extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.import = this.import.bind(this);
    this.state = {
      uploading: false,
      fileType: SpreadsheetType.ClassroomChecks,
      importMode: SpreadsheetImportMode.OverwriteAndAppend,
    };
  }

  componentDidMount() {
    this.fetchRestoreOptions();
  }

  fetchRestoreOptions() {
    fetch("/api/v1/restore")
      .then(response => response.json())
      .then((options): void => {
        this.setState({ restoreOptions: options });
      }).catch(error => {
        console.error("Failed to fetch restore options");
        console.error(error);
      });
  }

  onSpreadsheetToImportSelect = (selected?: File | FileList): void => {
    if (selected !== undefined && selected instanceof File) {
      const type = this.getTypeFromFileName(selected.name);
      if (type === undefined) return;
      const version = SpreadsheetUtils.matchVersion(type, selected.name);
      this.setState({
        file: selected,
        fileType: type,
        fileVersion: version,
      });
    }
  };

  getTypeFromFileName = (name: string): SpreadsheetType | undefined => {
    if (name.toLocaleLowerCase().includes("classroom checks")) {
      return SpreadsheetType.ClassroomChecks;
    }
    if (name.toLocaleLowerCase().includes("troubleshooting")) {
      return SpreadsheetType.Troubleshooting;
    }
    return undefined;
  };

  import = () => {
    const {
      file,
      fileVersion,
      importMode,
    } = this.state;

    if (file === undefined) {
      alert("You must select something to import");
      return;
    }

    console.debug("Compiling form data..");
    const data = new FormData();
    if (file !== undefined) {
      data.append("file", file);
      if (fileVersion !== undefined) {
        data.append("fileVersion", `${fileVersion}`);
      }
      if (importMode !== undefined) {
        data.append("importMode", `${importMode}`);
      }
    }

    console.debug(`${file.name} ${fileVersion} ${importMode}`);

    console.debug("Beginning upload..");
    this.setState({ uploading: true }, () => {
      fetch("/api/v1/upload/classroom-checks", { method: "POST", body: data })
        .then(() => {
          this.setState({ uploading: false }, () => {
            console.debug("Upload complete");
          });
        }).catch(error => {
          console.error("Failed to upload file");
          console.error(error);
        });
    });
  };

  export = () => {
  };

  onRestoreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { target } = event;
    const { value } = target;
    this.setState({
      selectedRestorePoint: value,
    });
  };

  backup = () => {
    fetch("/api/v1/backup")
      .then(() => {
        alert("Backup complete");
      }).catch(error => {
        console.error("Failed to backup ");
        console.error(error);
      });
  };

  restore = () => {
    const { selectedRestorePoint } = this.state;
    if (selectedRestorePoint === undefined) {
      alert("You must select a restore point!");
      return;
    }

    console.debug(`Restoring ${selectedRestorePoint}`);

    fetch("/api/v1/restore", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        restorePoint: selectedRestorePoint,
      }),
    })
      .then(() => {
        console.log("Restore complete");
      }).catch(error => {
        console.error("Failed to restore ");
        console.error(error);
      });
  };

  onImportTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { target } = event;
    if (target === null) return;
    const { value } = target;
    if (value === null || value === undefined) return;
    const parsed = EnumUtils.parse(SpreadsheetType, value);
    if (parsed === undefined) return;
    this.setState({
      fileType: parsed,
    });
  };

  onImportVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { target } = event;
    if (target === null) return;
    const { value } = target;
    if (value === null || value === undefined) return;
    const { fileType } = this.state;

    const parsed = EnumUtils.parse(fileType === SpreadsheetType.ClassroomChecks ? ClassroomChecksSpreadsheetVersion : TroubleshootingSpreadsheetVersion, value);
    if (parsed === undefined) return;
    this.setState({
      fileVersion: parsed,
    });
  };

  onImportModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { target } = event;
    if (target === null) return;
    const { value } = target;
    if (value === null || value === undefined) return;
    const parsed = EnumUtils.parse(SpreadsheetImportMode, value);
    if (parsed === undefined) return;
    this.setState({
      importMode: parsed,
    });
  };

  render() {

    const {
      uploading,
      file,
      fileType,
      fileVersion,
      importMode,

      restoreOptions,
    } = this.state;

    return (
      <Fragment>
        {/* Top navigation */}
        <NavBar
          title="CCSS Support Manual"
          fixed
        />
        {/* Main content */}
        <section className="container" id="settings-section">


          <div id="#data">
            <div className="row">
              <div className="col">
                <h2>Data</h2>
              </div>
            </div>

            {/* Import Data from Spreadsheet */}
            <div className="row segment">
              <div className="col">
                <h3>Import Data from Spreadsheet</h3>

                <div className="row">
                  <div className="col">
                    <h4>Spreadsheet File</h4>
                    <FileSelect
                      types={["xlsx"]}
                      onSelect={this.onSpreadsheetToImportSelect}
                    />
                  </div>
                  <div className="col">
                    <h4>Spreadsheet Type</h4>
                    <Select
                      readonly={file === undefined}
                      values={EnumUtils.values(SpreadsheetType)}
                      onChange={this.onImportTypeChange}
                      current={SpreadsheetType[fileType]}
                    />
                  </div>
                  <div className="col">
                    <h4>Spreadsheet Version</h4>
                    <Select
                      readonly={file === undefined}
                      values={EnumUtils.values(fileType === SpreadsheetType.ClassroomChecks ? ClassroomChecksSpreadsheetVersion : TroubleshootingSpreadsheetVersion)}
                      onChange={this.onImportVersionChange}
                      current={fileType === SpreadsheetType.ClassroomChecks ? ClassroomChecksSpreadsheetVersion[fileVersion!] : TroubleshootingSpreadsheetVersion[fileVersion!]}
                    />
                  </div>
                  <div className="col">
                    <h4>Data Import Mode</h4>
                    <Select
                      readonly={file === undefined}
                      values={EnumUtils.values(SpreadsheetImportMode)}
                      onChange={this.onImportModeChange}
                      current={SpreadsheetImportMode[importMode]}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={this.import}
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* Export Data to Spreadsheet */}
            <div className="row segment">
              <div className="col">
                <div className="row">
                  <div className="col">
                    <h3>Export Data to Spreadsheet</h3>
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
                    <h3>Backup Data</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button type="button" onClick={this.backup}>Backup</button>
                  </div>
                </div>
              </div>
            </div>


            {/* Restore Data */}
            <div className="row segment">
              <div className="col">
                <div className="row">
                  <div className="col">
                    <h3>Restore Data</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Select
                      size={5}
                      values={restoreOptions}
                      onChange={this.onRestoreChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button type="button" onClick={this.restore}>Restore</button>
                  </div>
                </div>
              </div>
            </div>


            {/* Save Data */}
            <div className="row segment">
              <div className="col">
                <h3>Save Data</h3>
                <div className="row">
                  <div className="col">
                    <button type="button">Save</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>
      </Fragment>
    );
  }
}
