import "./style.scss";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Logger, StringUtils } from "@michaelgatesdev/common";

import { BackupRestoreOptions } from "@ccss-support-manual/models";

import withRestoreOptions from "../../../../Components/Select/withRestoreOptions";
import Select from "../../../../Components/Select";

import { AppState } from "../../../../redux/store";
import { RestoreState } from "../../../../redux/restore/types";
import { performRestore } from "../../../../redux/restore/actions";
import Button, { ButtonType } from "../../../../Components/Button";
import { SettingsSegment } from "../../SettingsSegment";
import { NamedRow } from "../../../../Components/NamedRow";
import { LabeledCheckBox } from "../../../../Components/LabeledCheckBox";

interface Props {
  restoreState: RestoreState;
  performRestore: (options: BackupRestoreOptions) => Promise<void>;
}

enum RestoreSettingsType {
  Data,
  Images,
  Settings,
}

const RestoreDataSegment = (props: Props) => {
  const [restorePoint, setRestorePoint] = useState<string | undefined>();

  const [restoreBuildings, setRestoreBuildings] = useState<boolean>(true);
  const [restoreRooms, setRestoreRooms] = useState<boolean>(true);
  const [restoreTroubleshooting, setRestoreTroubleshooting] = useState<boolean>(true);

  const [restoreBuildingImages, setRestoreBuildingImages] = useState<boolean>(true);
  const [restoreRoomEquipmentImages, setRestoreRoomEquipmentImages] = useState<boolean>(true);
  const [restoreRoomPanoramicImages, setRestoreRoomPanoramicImages] = useState<boolean>(true);
  const [restoreRoomTitleImages, setRestoreRoomTitleImages] = useState<boolean>(true);
  const [restoreRoomCoverImages, setRestoreRoomCoverImages] = useState<boolean>(true);

  const [restoreApplicationConfig, setRestoreApplicationConfig] = useState<boolean>(true);
  const [restoreImagesConfig, setRestoreImagesConfig] = useState<boolean>(true);
  const [restoreTroubleshootingKeywordsConfig, setRestoreTroubleshootingKeywordsConfig] = useState<boolean>(true);

  const { restoreState, performRestore } = props;

  useEffect(() => {}, []);

  const modifyAll = (type: RestoreSettingsType, active: boolean): void => {
    switch (type) {
      default:
        break;
      case RestoreSettingsType.Data:
        setRestoreBuildings(active);
        setRestoreRooms(active);
        setRestoreTroubleshooting(active);
        break;
      case RestoreSettingsType.Images:
        setRestoreBuildingImages(active);
        setRestoreRoomEquipmentImages(active);
        setRestoreRoomPanoramicImages(active);
        setRestoreRoomTitleImages(active);
        setRestoreRoomCoverImages(active);
        break;
      case RestoreSettingsType.Settings:
        setRestoreApplicationConfig(active);
        setRestoreImagesConfig(active);
        setRestoreTroubleshootingKeywordsConfig(active);
        break;
    }
  };

  const resetRestoreForm = () => {
    modifyAll(RestoreSettingsType.Data, true);
    modifyAll(RestoreSettingsType.Images, true);
    modifyAll(RestoreSettingsType.Settings, true);
    setRestorePoint(undefined);
  };

  const restore = async () => {
    if (restoreState.restoring) {
      alert("A restore is already being performed!");
      return;
    }

    if (restorePoint === undefined || StringUtils.isBlank(restorePoint)) {
      alert("You must specify restore point");
      return;
    }

    try {
      await performRestore({
        name: restorePoint,
        data: {
          all: restoreBuildings && restoreRooms && restoreTroubleshooting,
          buildings: restoreBuildings,
          rooms: restoreRooms,
          troubleshooting: restoreTroubleshooting,
        },
        images: {
          all: restoreBuildingImages && restoreRoomEquipmentImages && restoreRoomEquipmentImages && restoreRoomPanoramicImages && restoreRoomTitleImages && restoreRoomCoverImages,
          buildingImages: restoreBuildingImages,
          room_equipmentImages: restoreRoomEquipmentImages,
          room_panoramicImages: restoreRoomPanoramicImages,
          room_titleImages: restoreRoomTitleImages,
          room_coverImages: restoreRoomCoverImages,
        },
        settings: {
          all: restoreApplicationConfig && restoreImagesConfig && restoreTroubleshootingKeywordsConfig,
          applicationConfig: restoreApplicationConfig,
          imagesConfig: restoreImagesConfig,
          troubleshootingKeywordsConfig: restoreTroubleshootingKeywordsConfig,
        },
      });
    } catch (error) {
      console.error("An error occured while attempting to restore data.");
      console.error(error);
    } finally {
      resetRestoreForm();
    }
  };

  const SelectWithRestoreOptions = withRestoreOptions(Select);

  return (
    <SettingsSegment title="Restore Data">
      <>
        {/* Restore File Name */}
        <NamedRow
          headerType={4}
          columns={[
            {
              title: "Restore Point",
              content: (
                <>
                  {/* Error messages row */}
                  {restoreState !== undefined && restoreState.error && (
                    <div className="row">
                      <div className="col">
                        <div className="alert alert-danger" role="alert">
                          {restoreState.error}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Options */}
                  <SelectWithRestoreOptions size={1} onChange={setRestorePoint} current={restorePoint} />
                </>
              ),
            },
          ]}
        />

        {/* Restore Data Options */}
        <NamedRow
          headerType={4}
          columns={[
            {
              title: "Restore Data",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(RestoreSettingsType.Data, true);
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
                          modifyAll(RestoreSettingsType.Data, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox title="Buildings" id="restoreBuildings" titleRight onChange={setRestoreBuildings} checked={restoreBuildings} />
                    </li>
                    <li>
                      <LabeledCheckBox title="Rooms" id="restoreRooms" titleRight onChange={setRestoreRooms} checked={restoreRooms} />
                    </li>
                    <li>
                      <LabeledCheckBox title="Troubleshooting" id="restoreTroubleshooting" titleRight onChange={setRestoreTroubleshooting} checked={restoreTroubleshooting} />
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: "Restore Images",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(RestoreSettingsType.Images, true);
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
                          modifyAll(RestoreSettingsType.Images, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox title="Building Images" id="restoreBuildingImages" titleRight onChange={setRestoreBuildingImages} checked={restoreBuildingImages} />
                    </li>
                    <li>
                      <LabeledCheckBox title="(Room) Equipment Images" id="restoreRoomEquipmentImages" titleRight onChange={setRestoreRoomEquipmentImages} checked={restoreRoomEquipmentImages} />
                    </li>
                    <li>
                      <LabeledCheckBox title="(Room) Panoramic Images" id="restoreRoomPanoramicImages" titleRight onChange={setRestoreRoomPanoramicImages} checked={restoreRoomPanoramicImages} />
                    </li>
                    <li>
                      <LabeledCheckBox title="(Room) Title Images" id="restoreRoomTitleImages" titleRight onChange={setRestoreRoomTitleImages} checked={restoreRoomTitleImages} />
                    </li>
                    <li>
                      <LabeledCheckBox title="(Room) Cover Images" id="restoreRoomCoverImages" titleRight onChange={setRestoreRoomCoverImages} checked={restoreRoomCoverImages} />
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: "Restore Settings",
              content: (
                <>
                  <div className="row">
                    <div className="col">
                      <Button
                        buttonType={ButtonType.Secondary}
                        onClick={() => {
                          modifyAll(RestoreSettingsType.Settings, true);
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
                          modifyAll(RestoreSettingsType.Settings, false);
                        }}
                        preventDefault
                      >
                        <span>Select None</span>
                      </Button>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <LabeledCheckBox title="Application Config" id="restoreBuildingImages" titleRight onChange={setRestoreApplicationConfig} checked={restoreApplicationConfig} />
                    </li>
                    <li>
                      <LabeledCheckBox title="Images Config" id="restoreRoomEquipmentImages" titleRight onChange={setRestoreImagesConfig} checked={restoreImagesConfig} />
                    </li>
                    <li>
                      <LabeledCheckBox
                        title="Troubleshooting Keywords Config"
                        id="restoreRoomPanoramicImages"
                        titleRight
                        onChange={setRestoreTroubleshootingKeywordsConfig}
                        checked={restoreTroubleshootingKeywordsConfig}
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
            <Button buttonType={ButtonType.Secondary} disabled={restoreState.restoring} onClick={restore} preventDefault>
              <span>Restore</span>
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        {restoreState.restoring && (
          <div className="row">
            <div className="col">
              <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        )}
      </>
    </SettingsSegment>
  );
};

const mapStateToProps = (state: AppState) => ({
  restoreState: state.restore,
});

export const mapDispatchToProps = {
  performRestore,
};

export default connect(mapStateToProps, mapDispatchToProps)(RestoreDataSegment);
