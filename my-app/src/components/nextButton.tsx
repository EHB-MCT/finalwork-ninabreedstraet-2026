import { Link, useLocation } from "react-router-dom";
import { exercises } from "./codeEditor";

export default function NextButton() {
  const location = useLocation();
  const currentIndex = exercises.indexOf(location.pathname);

  if (currentIndex === -1 || currentIndex === exercises.length - 1) {
    return null;
  }

  const nextPath = exercises[currentIndex + 1];

  return (
    <div style={{ marginTop: "20px" }}>
      <Link
        to={nextPath}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          display: "inline-block",
        }}
      >
        Volgende ▸
      </Link>
    </div>
  );
}
