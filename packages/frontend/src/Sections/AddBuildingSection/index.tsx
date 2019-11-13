import "./style.scss";

import React, { useState } from "react";

import { StringUtils } from "@michaelgatesdev/common";

import NavBar from "../../Components/NavBar";
import { LabeledFormInput } from "../../Components/LabeledFormInput";
import { LabeledInputList } from "../../Components/LabeledInputList";
import Button from "../../Components/Button";


interface Props {
  addBuilding: (officialName: string, nicknames: string[]) => {};
}

const AddBuildingSection = (props: Props) => {

  const [officialName, setOfficialName] = useState<string>("");
  const [nicknames, setNicknames] = useState<string[]>([]);

  const {
    addBuilding,
  } = props;

  const performAddBuilding = () => {
    if (StringUtils.isBlank(officialName)) {
      alert("The official name must be specified");
      return;
    }
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

export default AddBuildingSection;
