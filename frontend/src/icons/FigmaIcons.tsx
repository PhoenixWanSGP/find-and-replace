// FigmaIcons.tsx
import * as React from "react";

interface IconProps {
  width?: string;
  height?: string;
  fillColor?: string;
}

export const FigmaTextIcon: React.FC<IconProps> = ({
  width = "10",
  height = "10",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H0.5H5H9.5H10V0.5V3H9V1H5.5V9H7V10H5H3V9H4.5V1H1V3H0V0.5V0Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaSliceIcon: React.FC<IconProps> = ({
  width = "10",
  height = "10",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0H3V1H7V0ZM1 1V0H0V1H1ZM0 3H1V7H0V3ZM9 3H10V7H9V3ZM10 1H9V0H10V1ZM3 9H7V10H3V9ZM1 9H0V10H1V9ZM9 10V9H10V10H9Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaComponentIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.74279 2.74795L6.00006 0.5L8.25733 2.74795L6.00006 4.9959L3.74279 2.74795ZM2.74819 8.25707L0.500244 5.9998L2.74819 3.74253L4.99614 5.9998L2.74819 8.25707ZM8.25731 9.25166L6.00004 11.4996L3.74278 9.25166L6.00004 7.00371L8.25731 9.25166ZM11.4999 5.99981L9.25191 3.74254L7.00396 5.99981L9.25191 8.25708L11.4999 5.99981Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaInstanceIcon: React.FC<IconProps> = ({
  width = "14",
  height = "14",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.828369 6.99988L1.16424 6.664L6.66425 1.164L7.00012 0.828125L7.336 1.164L12.836 6.664L13.1719 6.99988L12.836 7.33575L7.336 12.8358L7.00012 13.1716L6.66425 12.8358L1.16424 7.33575L0.828369 6.99988ZM7.00012 11.8281L11.8284 6.99988L7.00012 2.17163L2.17187 6.99988L7.00012 11.8281Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaGroupIcon: React.FC<IconProps> = ({
  width = "10",
  height = "10",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 0H4V1H6V0ZM8.5 9H9V8.5H10V9V10H9H8.5V9ZM1 4V6H0V4H1ZM9 1.5V1H8.5V0H9H10V1V1.5H9ZM9 4V6H10V4H9ZM1 1.5V1H1.5V0H1H0V1V1.5H1ZM0 9V8.5H1V9H1.5V10H1H0V9ZM6 9H4V10H6V9Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaMaskIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.86036 1.64556C5.22433 1.55057 5.60626 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C5.60625 10.5 5.2243 10.4494 4.86031 10.3544C6.16184 9.34856 7 7.77215 7 5.99998C7 4.22783 6.16186 2.65143 4.86036 1.64556ZM6 0.5C2.96243 0.5 0.5 2.96243 0.5 6C0.5 9.03757 2.96243 11.5 6 11.5C9.03757 11.5 11.5 9.03757 11.5 6C11.5 2.96243 9.03757 0.5 6 0.5Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaFrameIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0.5V1V3H8V1V0.5H9V1V3H11H11.5V4H11H9L9 8H11H11.5V9H11H9V11V11.5H8V11V9H4V11V11.5H3V11V9H1H0.5V8H1H3L3 4H1H0.5V3H1H3V1V0.5H4ZM8 8V4H4L4 8H8Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaAnimationIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 1H11V11H1L1 1ZM0 1C0 0.447715 0.447715 0 1 0H11C11.5523 0 12 0.447715 12 1V11C12 11.5523 11.5523 12 11 12H1C0.447715 12 0 11.5523 0 11V1ZM8.50003 6L4.00003 3.5V8.5L8.50003 6Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaImageIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 1H1L1 7.29289L3.14645 5.14645L3.5 4.79289L3.85355 5.14645L9.70711 11H11V1ZM1 11L1 8.70711L3.5 6.20711L8.29289 11H1ZM1 0C0.447715 0 0 0.447715 0 1V11C0 11.5523 0.447715 12 1 12H11C11.5523 12 12 11.5523 12 11V1C12 0.447715 11.5523 0 11 0H1ZM9 4C9 4.55228 8.55228 5 8 5C7.44772 5 7 4.55228 7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4ZM10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaMissingFontIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="7 7 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="8" width="19" height="16" rx="4" fill="#FFEB00" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.0635 17.6992H19.0004C19.0004 16.1738 19.2686 15.679 20.1497 15.2098C20.6434 14.9468 21.0547 14.5859 21.0547 14.0078C21.0547 13.3164 20.6406 12.875 19.8516 12.875C19.0625 12.875 18.6356 13.1797 18.5887 14.0078H17.4968C17.5476 12.6016 18.3492 11.8906 19.8516 11.8906C21.3539 11.8906 22.1262 12.7383 22.1262 14.0078C22.1262 14.8633 21.6087 15.5584 20.9077 16C20.1783 16.4596 20.0635 16.5604 20.0635 17.6992ZM20.2872 19.2579C20.2872 19.6915 19.9318 20.0392 19.506 20.0392C19.0763 20.0392 18.7247 19.6915 18.7247 19.2579C18.7247 18.8321 19.0763 18.4806 19.506 18.4806C19.9318 18.4806 20.2872 18.8321 20.2872 19.2579ZM9.02686 20L12.138 12H13.1694L16.2805 20H15.2612L14.4737 17.975L10.8337 17.975L10.0462 20H9.02686ZM12.6537 13.2949L14.1043 17.025L11.2031 17.025L12.6537 13.2949Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaExternalIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="7 7 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.79297 15.5001L7.14652 15.1465L15.1465 7.14652L15.5001 6.79297L15.8536 7.14652L23.8536 15.1465L24.2072 15.5001L23.5001 16.2072L23.1465 15.8536L15.5001 8.20718L8.20718 15.5001L15.5001 22.793L19.1465 19.1465L19.5001 18.793L20.2072 19.5001L19.8536 19.8536L15.8536 23.8536L15.5001 24.2072L15.1465 23.8536L7.14652 15.8536L6.79297 15.5001ZM14.7072 15.0001H17.0001C20.3138 15.0001 23.0001 17.6864 23.0001 21.0001C23.0001 22.6569 22.3285 24.1569 21.2427 25.2427L20.5356 24.5356C21.4404 23.6308 22.0001 22.3808 22.0001 21.0001C22.0001 18.2387 19.7615 16.0001 17.0001 16.0001H14.7072L16.3536 17.6465L15.6465 18.3536L13.1465 15.8536L12.793 15.5001L13.1465 15.1465L15.6465 12.6465L16.3536 13.3536L14.7072 15.0001Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);

export const FigmaFontIcon: React.FC<IconProps> = ({
  width = "12",
  height = "12",
  fillColor = "black",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.12997 9L2.7777 7.00994H5.92685L6.57457 9H8.55185L5.54332 0.272727H3.16548L0.152699 9H2.12997ZM3.24645 5.5696L4.32031 2.26705H4.38849L5.46236 5.5696H3.24645ZM12.2124 11.5483C14.0831 11.5483 15.4126 10.696 15.4126 9.06392V2.45455H13.6101V3.55398H13.5419C13.299 3.02131 12.7663 2.36932 11.6712 2.36932C10.2351 2.36932 9.0206 3.4858 9.0206 5.71449C9.0206 7.89205 10.201 8.90625 11.6754 8.90625C12.7195 8.90625 13.3033 8.3821 13.5419 7.84091H13.6186V9.03835C13.6186 9.89489 13.0433 10.2443 12.255 10.2443C11.4538 10.2443 11.049 9.89489 10.8999 9.54119L9.22088 9.76705C9.43821 10.7557 10.4482 11.5483 12.2124 11.5483ZM12.2507 7.54261C11.3601 7.54261 10.8743 6.83523 10.8743 5.70597C10.8743 4.59375 11.3516 3.81392 12.2507 3.81392C13.1328 3.81392 13.6271 4.55966 13.6271 5.70597C13.6271 6.8608 13.1243 7.54261 12.2507 7.54261Z"
      fill={fillColor}
      fillOpacity="0.8"
    />
  </svg>
);
