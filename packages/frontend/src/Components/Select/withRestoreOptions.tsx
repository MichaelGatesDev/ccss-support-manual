import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AppState } from "../../redux/store";
import { fetchRestoreOptions } from "../../redux/restore/actions";
import { RestoreState } from "../../redux/restore/types";
import { SelectComponentProps } from ".";

interface Props extends SelectComponentProps {
  restoreState: RestoreState;
  fetchRestoreOptions: () => void;
}

const withRestoreOptions = (WrappedComponent: any) => (props: Props) => {
  const { restoreState, fetchRestoreOptions } = props;

  useEffect(() => {
    // Fix this from being a patch to the infinite load bug
    if (restoreState.loadingOptions) {
      fetchRestoreOptions();
    }
  }, []);

  return (
    <WrappedComponent
      {...props}
      placeholder={restoreState.loadingOptions ? "[Loading restore options...]" : "Select a restore point..."}
      values={restoreState.loadingOptions ? [] : restoreState.options}
    />
  );
};

// ============================================================================================ \\

const mapStateToProps = (state: AppState) => ({
  restoreState: state.restore,
});

export const mapDispatchToProps = {
  fetchRestoreOptions,
};

export default (WrapperComponent: any) => connect(mapStateToProps, mapDispatchToProps)(withRestoreOptions(WrapperComponent));
