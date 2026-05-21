const CreateIcon = ({ color = "black", size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="/Images/Create.svg"
  >
    <polyline
      points="73.9 30.02 29.03 30.02 29.03 135.31 134.33 135.31 134.33 86.76"
      stroke={color}
      strokeLinejoin="bevel"
      strokeWidth="21"
    />
    <polygon
      points="117.32 24.69 107.26 34.61 62.85 78.43 56.4 107.45 85.82 101.72 139.53 47.26 117.32 24.69"
      stroke={color}
      strokeWidth="17"
    />
    <line
      x1="64"
      y1="81.26"
      x2="83.68"
      y2="101.1"
      stroke={color}
      strokeWidth="17"
    />
  </svg>
);

export default CreateIcon;
