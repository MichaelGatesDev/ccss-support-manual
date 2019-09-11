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
import Button from "../../Components/Button";
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
          <div className="SettingsSection-Component">

            <p>
              Uploading:&nbsp;
              {uploading ? "true" : "false"}
            </p>

            <h2>Data</h2>

            {/* Import Data from Spreadsheet */}
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
            <br />
            <div className="row">
              <div className="col">
                <Button
                  disabled={uploading}
                  preventDefault={false}
                  title="Import"
                  onClick={this.import}
                />
              </div>
            </div>

          </div>
        </section>
      </Fragment>
    );
  }
}
