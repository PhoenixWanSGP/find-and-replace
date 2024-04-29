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
