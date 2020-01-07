import "./style.scss";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface Props {
  minScrollAmt: number;
}


export default (props: Props): JSX.Element | null => {

  const [visible, setVisible] = useState<boolean>(false);

  const onClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    window.scrollTo(0, 0);
  };

  const handleScroll = (): void => {
    const { minScrollAmt } = props;
    const currentScrollAmt = window.scrollY;
    setVisible(currentScrollAmt > minScrollAmt);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // if (!visible) return null;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="BackToTopButton-Component"
          key="back-to-top-button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            id="backToTop"
            type="submit"
            className="btn btn-primary"
            onClick={onClick}
            data-toggle="tooltip"
            title="Back to Top"
          >
            <span>
              <i className="fas fa-arrow-alt-circle-up" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
