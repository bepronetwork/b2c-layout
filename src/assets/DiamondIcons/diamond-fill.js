import React from "react";

function diamondFill({ fill, color, styles }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 30 28"
      fill={{ ...fill }}
      style={styles}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.3202 9.49288L23.7202 2.82588C23.1482 2.15188 22.3442 1.68888 21.4332 1.56188L21.4142 1.55988L15.4412 0.826875C15.3092 0.807875 15.1562 0.796875 15.0012 0.796875C14.8462 0.796875 14.6932 0.807875 14.5442 0.828875L14.5612 0.826875L8.58822 1.55988C7.65722 1.68988 6.85422 2.15188 6.28622 2.82088L6.28222 2.82588L0.682219 9.49288C0.459219 9.75588 0.324219 10.0989 0.324219 10.4729C0.324219 10.8469 0.459219 11.1899 0.684219 11.4549L0.682219 11.4529L13.8422 26.7329C14.1222 27.0449 14.5262 27.2399 14.9752 27.2399C15.4242 27.2399 15.8292 27.0449 16.1072 26.7339L16.1082 26.7329L29.2682 11.4529C29.5072 11.1859 29.6542 10.8309 29.6542 10.4409C29.6542 10.0809 29.5292 9.74987 29.3202 9.48987L29.3222 9.49288H29.3202Z"
        fill={color}
      />
    </svg>
  );
}

export default diamondFill;
