const ExcerciseIcon = ({ color = "black", size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="/Images/Oef.svg"
  >
    <polyline
      points="68.44 30.2 23.57 30.2 23.57 135.5 128.87 135.5 128.87 86.95"
      stroke={color}
      strokeLinejoin="bevel"
      strokeWidth="21"
    />
    <polyline
      points="51.71 66.32 78.63 92.92 144.86 24.5"
      stroke={color}
      strokeWidth="23"
    />
  </svg>
);

export default ExcerciseIcon;
