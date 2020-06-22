import "./style.scss";

import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Building } from "@ccss-support-manual/models";

import { LabeledFormInput } from "../../Components/LabeledFormInput";
import { LabeledInputList } from "../../Components/LabeledInputList";
import { Alert, AlertType } from "../../Components/Alert/alert";
import Button, { ButtonType } from "../../Components/Button";
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

  const { buildingsState, addBuilding } = props;

  const performAddBuilding = () => {
    // if (StringUtils.isBlank(officialName)) {
    //   alert("The official name must be specified");
    //   return;
    // }
    addBuilding(officialName, nicknames);
  };

  const building = buildingsState.data as Building;

  return (
    <>
      {/* Main content */}
      <section className="container" id="add-building-section">
        {/* Breadcrumbs */}
        <div className="container">
          <div className="row">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/buildings">Buildings</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Building
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {/* Info alert */}
            {buildingsState.data && (
              <Alert alertType={AlertType.Success} id="info-alert">
                <p>Succesfully addded new building!</p>
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    Official Name:&nbsp;
                  </span>
                  <span>{building.officialName}</span>
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Nicknames:&nbsp;</span>
                  <span>
                    {building.nicknames.length > 0
                      ? building.nicknames.join(", ")
                      : "(none specified)"}
                  </span>
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
              buttonType={ButtonType.Success}
              preventDefault
              fullWidth
              onClick={performAddBuilding}
            >
              <span className="w-100">Add Building</span>
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

export default connect(mapStateToProps, {
  addBuilding,
})(AddBuildingSection);
