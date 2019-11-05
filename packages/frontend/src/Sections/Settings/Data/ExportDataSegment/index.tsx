import "./style.scss";

import React, { } from "react";
import { connect } from "react-redux";

import { AppState } from "../../../../redux/store";

interface Props {
}

const ExportDataSegment = () => (
  <div className="row segment">
    <div className="col">
      {/* Import Header */}
      <div className="row">
        <div className="col">
          <h3>Export data</h3>
        </div>
      </div>

      {/* Error messages row */}
      <div className="row">
        <div className="col">
          {
            // exportState !== undefined && exportState.error &&
            // (
            //   <div className="alert alert-danger" role="alert">
            //     {exportState.error}
            //   </div>
            // )
          }
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p>This feature is not available yet</p>
        </div>
      </div>
    </div>
  </div>
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
