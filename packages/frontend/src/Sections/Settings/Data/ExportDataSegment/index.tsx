import "./style.scss";

import React, { } from "react";
import { connect } from "react-redux";

import { AppState } from "../../../../redux/store";
import { SettingsSegment } from "../../SettingsSegment";

interface Props {
}

const ExportDataSegment = () => (
  <SettingsSegment
    id="export-data"
    segmentTitle="Export Data"
    segmentContent={(
      <>
        <div className="row">
          <div className="col">
            <p>This feature is not available yet</p>
          </div>
        </div>
      </>
    )}
  />
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
