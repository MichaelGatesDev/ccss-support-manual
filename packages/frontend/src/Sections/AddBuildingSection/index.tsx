import "./style.scss";

import React, { useState } from "react";
import { connect } from "react-redux";

import { StringUtils } from "@michaelgatesdev/common";

import { Building } from "@ccss-support-manual/models";

import NavBar from "../../Components/NavBar";
import { LabeledFormInput } from "../../Components/LabeledFormInput";
import { LabeledInputList } from "../../Components/LabeledInputList";
import { Alert, AlertType } from "../../Components/Alert/alert";
import Button from "../../Components/Button";
import { AppState } from "../../redux/store";
import { addBuilding } from "../../redux/buildings/actions";
import { BuildingsState } from "../../redux/buildings/types";

interface Props {
  buildingsState: BuildingsState;
  addBuilding: (officialName: string, nicknames: string[]) => Promise<void>;
}

const AddBuildingSection = (props: Props) => {

  const [officialName, setOfficialName] = useState<string>("");
  const [nicknames, setNicknames] = useState<string[]>([]);

  const {
    buildingsState,
    addBuilding,
  } = props;

  const performAddBuilding = () => {
    // if (StringUtils.isBlank(officialName)) {
    //   alert("The official name must be specified");
    //   return;
    // }
    addBuilding(officialName, nicknames);
  };

  return (
    <>
      {/* Top navigation */}
      <NavBar
        title="CCSS Support Manual"
        fixed
      />
      {/* Main content */}
      <section className="container" id="add-building-section">

        <div className="row">
          <div className="col">
            {/* Info alert */}
            {buildingsState.data && (
              <Alert alertType={AlertType.Info} id="info-alert">
                <p>Added new building!</p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Official Name:&nbsp;</span>
                  <span>{(buildingsState.data as Building).officialName}</span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Nicknames:&nbsp;</span>
                  <span>{(buildingsState.data as Building).nicknames.join(", ")}</span>
                </p>
              </Alert>
            )}
            {/* Error alert */}
            {buildingsState.error && (
              <Alert alertType={AlertType.Danger} id="error-alert">
                <span>{buildingsState.error}</span>
              </Alert>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h2>Add Building</h2>
          </div>
        </div>

        {/* Official Name */}
        <div className="row">
          <div className="col">
            <LabeledFormInput
              id="building-official-name"
              onChange={setOfficialName}
              value={officialName}

              title="Official Name"
              titleLeft
            />
          </div>
        </div>

        {/* Nicknames */}
        <div className="row">
          <div className="col">
            <LabeledInputList
              id="building-nicknames"
              values={nicknames}
              title="Nicknames"
              titleLeft
              onChange={setNicknames}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Button
              preventDefault
              fullWidth
              onClick={performAddBuilding}
            >
              <span>Add Building</span>
            </Button>
          </div>
        </div>

      </section>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  buildingsState: state.buildings,
});

export default connect(
  mapStateToProps,
  {
    addBuilding,
  },
)(AddBuildingSection);
