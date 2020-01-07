import "./style.scss";

import React, { } from "react";
import { connect } from "react-redux";

import { AppState } from "../../../../redux/store";
import { SettingsSegment } from "../../SettingsSegment";

const ExportDataSegment = () => (
  <SettingsSegment
    id="export-data"
    title="Export Data"
  >
    <>
      <div className="row">
        <div className="col">
          <p>This feature is not available yet</p>
        </div>
      </div>
    </>
  </SettingsSegment>
);


const mapStateToProps = (state: AppState) => ({
  exportState: state.import,
});

export const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportDataSegment);
