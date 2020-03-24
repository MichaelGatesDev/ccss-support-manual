import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Logger, StringUtils } from "@michaelgatesdev/common";

import { BackupRestoreOptions } from "@ccss-support-manual/models";

import { AppState } from "../../../../redux/store";
import { BackupState } from "../../../../redux/backup/types";
import { performBackup } from "../../../../redux/backup/actions";
import Button, { ButtonType } from "../../../../Components/Button";
import FormInput from "../../../../Components/FormInput";
import { SettingsSegment } from "../../SettingsSegment";
import { NamedRow } from "../../../../Components/NamedRow";
import { LabeledCheckBox } from "../../../../Components/LabeledCheckBox";

interface Props {
  backupState: BackupState;
  performBackup: (options: BackupRestoreOptions) => Promise<void>;
}

enum BackupSettingsType {
  Data,
  Images,
  Settings,
}

const BackupDataSegment = (props: Props) => {
  const [backupName, setBackupName] = useState<string>("");

  const [backupBuildings, setBackupBuildings] = useState<boolean>(true);
  const [backupRooms, setBackupRooms] = useState<boolean>(true);
  const [backupTroubleshooting, setBackupTroubleshooting] = useState<boolean>(
    true
  );

  const [backupBuildingImages, setBackupBuildingImages] = useState<boolean>(
    true
  );
  const [backupRoomEquipmentImages, setBackupRoomEquipmentImages] = useState<
    boolean
  >(true);
  const [backupRoomPanoramicImages, setBackupRoomPanoramicImages] = useState<
    boolean
  >(true);
  const [backupRoomTitleImages, setBackupRoomTitleImages] = useState<boolean>(
    true
  );
  const [backupRoomCoverImages, setBackupRoomCoverImages] = useState<boolean>(
    true
  );

  const [backupApplicationConfig, setBackupApplicationConfig] = useState<
    boolean
  >(true);
  const [backupImagesConfig, setBackupImagesConfig] = useState<boolean>(true);
  const [
    backupTroubleshootingKeywordsConfig,
    setBackupTroubleshootingKeywordsConfig,
  ] = useState<boolean>(true);

  const { backupState, performBackup } = props;

  useEffect(() => {}, []);

  if (backupState === undefined) {
    return <p>Waiting for backup state..</p>; // TODO splash screen
  }

  const modifyAll = (type: BackupSettingsType, active: boolean): void => {
    switch (type) {
      default:
        break;
      case BackupSettingsType.Data:
        setBackupBuildings(active);
        setBackupRooms(active);
        setBackupTroubleshooting(active);
        break;
      case BackupSettingsType.Images:
        setBackupBuildingImages(active);
        setBackupRoomEquipmentImages(active);
        setBackupRoomPanoramicImages(active);
        setBackupRoomTitleImages(active);
        setBackupRoomCoverImages(active);
        break;
      case BackupSettingsType.Settings:
        setBackupApplicationConfig(active);
        setBackupImagesConfig(active);
        setBackupTroubleshootingKeywordsConfig(active);
        break;
    }
  };

  const resetBackupForm = () => {
    modifyAll(BackupSettingsType.Data, true);
    modifyAll(BackupSettingsType.Images, true);
    modifyAll(BackupSettingsType.Settings, true);
    setBackupName("");
  };

  const backup = async () => {
    if (backupState.backingUp) {
      alert("A backup is already being performed!");
      return;
    }

    if (StringUtils.isBlank(backupName)) {
      alert("You must specify a name for the backup");
      return;
    }

    try {
      await performBackup({
        name: backupName,
        data: {
          all: backupBuildings && backupRooms && backupTroubleshooting,
          buildings: backupBuildings,
          rooms: backupRooms,
          troubleshooting: backupTroubleshooting,
        },
        images: {
          all:
            backupBuildingImages &&
            backupRoomEquipmentImages &&
            backupRoomEquipmentImages &&
            backupRoomPanoramicImages &&
            backupRoomTitleImages &&
            backupRoomCoverImages,
          buildingImages: backupBuildingImages,
          room_equipmentImages: backupRoomEquipmentImages,
          room_panoramicImages: backupRoomPanoramicImages,
          room_titleImages: backupRoomTitleImages,
          room_coverImages: backupRoomCoverImages,
        },
        settings: {
          all:
            backupApplicationConfig &&
            backupImagesConfig &&
            backupTroubleshootingKeywordsConfig,
          applicationConfig: backupApplicationConfig,
          imagesConfig: backupImagesConfig,
          troubleshootingKeywordsConfig: backupTroubleshootingKeywordsConfig,
        },
      });
    } catch (error) {
      Logger.error("An error occured while attempting to backup data.");
      Logger.error(error);
    } finally {
      resetBackupForm();
    }
  };

  return (
    <SettingsSegment id="backup-data" title="Backup Data">
      <>
        {/* Error messages row */}
        {backupState !== undefined && backupState.error && (
          <div className="row">
            <div className="col">
              <div className="alert alert-danger" role="alert">
                {backupState.error}
              </div>
            </div>
          </div>
        )}

        {/* Backup File Name */}
        <NamedRow
          id="backup-file-name-row"
          headerType={4}
          columns={[
            {
              title: "Backup File Name",
              content: (
                <FormInput
                  onChange={setBackupName}
                  value={backupName}
                  placeholder="my-cool-backup"
                />
              ),
            },
          ]}
        />

        {/* Backup Data Options */}
        <NamedRow
          headerType={4}
          columns={[
            {
              title: "Backup Data",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Data, true);
                        }}
                        preventDefault
                      >
                        <span>Select All</span>
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Data, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox
                        title="Buildings"
                        id="backupBuildings"
                        titleRight
                        onChange={setBackupBuildings}
                        checked={backupBuildings}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="Rooms"
                        id="backupRooms"
                        titleRight
                        onChange={setBackupRooms}
                        checked={backupRooms}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="Troubleshooting"
                        id="backupTroubleshooting"
                        titleRight
                        onChange={setBackupTroubleshooting}
                        checked={backupTroubleshooting}
                      />
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: "Backup Images",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Images, true);
                        }}
                        preventDefault
                      >
                        <span>Select All</span>
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Images, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox
                        title="Building Images"
                        id="backupBuildingImages"
                        titleRight
                        onChange={setBackupBuildingImages}
                        checked={backupBuildingImages}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="(Room) Equipment Images"
                        id="backupRoomEquipmentImages"
                        titleRight
                        onChange={setBackupRoomEquipmentImages}
                        checked={backupRoomEquipmentImages}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="(Room) Panoramic Images"
                        id="backupRoomPanoramicImages"
                        titleRight
                        onChange={setBackupRoomPanoramicImages}
                        checked={backupRoomPanoramicImages}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="(Room) Title Images"
                        id="backupRoomTitleImages"
                        titleRight
                        onChange={setBackupRoomTitleImages}
                        checked={backupRoomTitleImages}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="(Room) Cover Images"
                        id="backupRoomCoverImages"
                        titleRight
                        onChange={setBackupRoomCoverImages}
                        checked={backupRoomCoverImages}
                      />
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: "Backup Settings",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Settings, true);
                        }}
                        preventDefault
                      >
                        <span>Select All</span>
                      </Button>
                    </div>
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(BackupSettingsType.Settings, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox
                        title="Application Config"
                        id="backupBuildingImages"
                        titleRight
                        onChange={setBackupApplicationConfig}
                        checked={backupApplicationConfig}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="Images Config"
                        id="backupRoomEquipmentImages"
                        titleRight
                        onChange={setBackupImagesConfig}
                        checked={backupImagesConfig}
                      />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="Troubleshooting Keywords Config"
                        id="backupRoomPanoramicImages"
                        titleRight
                        onChange={setBackupTroubleshootingKeywordsConfig}
                        checked={backupTroubleshootingKeywordsConfig}
                      />
                    </li>
                  </ul>
                </>
              ),
            },
          ]}
        />

        {/* Button */}
        <div className="row">
          <div className="col">
            <Button
              buttonType={ButtonType.Secondary}
              disabled={backupState.backingUp}
              onClick={backup}
              preventDefault
            >
              <span>Backup</span>
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        {backupState.backingUp && (
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
        )}
      </>
    </SettingsSegment>
  );
};

const mapStateToProps = (state: AppState) => ({
  backupState: state.backup,
});

export const mapDispatchToProps = {
  performBackup,
};

export default connect(mapStateToProps, mapDispatchToProps)(BackupDataSegment);
