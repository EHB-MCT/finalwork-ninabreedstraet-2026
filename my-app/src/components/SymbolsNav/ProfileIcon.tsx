const ProfileIcon = ({ color = "black", size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="/Images/Profile.svg"
  >
    <circle cx="81.95" cy="54.9" r="22.68" stroke={color} strokeWidth="17" />
    <path
      d="M31.68,127.78s.66-9.76,4.58-15.29c8.52-12.02,14.87-12.96,45.68-12.96,27.31,0,32.07,2.73,38.85,9.64,7.61,7.76,7.52,18.13,7.52,18.13"
      stroke={color}
      strokeWidth="17"
    />
  </svg>
);

export default ProfileIcon;
