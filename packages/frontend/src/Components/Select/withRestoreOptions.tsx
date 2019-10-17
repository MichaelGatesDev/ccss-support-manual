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

const withRestoreOptions = (WrappedComponent: any) => ((props: Props) => {

  useEffect(() => {
    const { fetchRestoreOptions } = props;
    fetchRestoreOptions();
  }, []);

  const { restoreState } = props;
  return (
    <WrappedComponent
      {...props}
      values={restoreState.loadingOptions ? ["Loading restore options..."] : restoreState.options}
    />
  );
});


// ============================================================================================ \\

const mapStateToProps = (state: AppState) => ({
  restoreState: state.restore,
});

export const mapDispatchToProps = {
  fetchRestoreOptions,
};

export default (WrapperComponent: any) => connect(mapStateToProps, mapDispatchToProps)(withRestoreOptions(WrapperComponent));
