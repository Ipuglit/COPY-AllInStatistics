import { forwardRef } from "react";

import PropTypes from "prop-types";

import VuiInputRoot from "src/vui/input/VuiInputRoot";
import VuiInputWithIconRoot from "src/vui/input/VuiInputWithIconRoot";
import VuiInputIconBoxRoot from "src/vui/input/VuiInputIconBoxRoot";
import VuiInputIconRoot from "src/vui/input/VuiInputIconRoot";

// Vision UI Dashboard React contexts
import { useVisionUIController } from "context";

const VuiInput = forwardRef(({ size, icon, error, success, disabled, ...rest }, ref) => {
  let template;
  const [controller] = useVisionUIController();
  const { direction } = controller;
  const iconDirection = icon.direction;

  if (icon.component && icon.direction === "left") {
    template = (
      <VuiInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <VuiInputIconBoxRoot ownerState={{ size }}>
          <VuiInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon.component}
          </VuiInputIconRoot>
        </VuiInputIconBoxRoot>
        <VuiInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
      </VuiInputWithIconRoot>
    );
  } else if (icon.component && icon.direction === "right") {
    template = (
      <VuiInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <VuiInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
        <VuiInputIconBoxRoot ownerState={{ size }}>
          <VuiInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon.component}
          </VuiInputIconRoot>
        </VuiInputIconBoxRoot>
      </VuiInputWithIconRoot>
    );
  } else {
    template = <VuiInputRoot {...rest} ref={ref} ownerState={{ size, error, success, disabled }} />;
  }

  return template;
});

// Setting default values for the props of VuiInput
VuiInput.defaultProps = {
  size: "medium",
  icon: {
    component: false,
    direction: "none",
  },
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the VuiInput
VuiInput.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    direction: PropTypes.oneOf(["none", "left", "right"]),
  }),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default VuiInput;
