export const rssiToStr = (rssi: number): string =>
  `${rssi} dBm (${Math.min(Math.round(2 * (rssi + 100)), 100)}%)`;

export const rssiToLevel = (rssi: number, numLevels: number): number => {
  const MIN_RSSI = -100.0;
  const MAX_RSSI = -55.0;
  if (rssi <= MIN_RSSI) {
    return 0;
  } else if (rssi >= MAX_RSSI) {
    return numLevels - 1;
  } else {
    const inputRange = MAX_RSSI - MIN_RSSI;
    const outputRange = numLevels - 1;
    return Math.trunc(((rssi - MIN_RSSI) * outputRange) / inputRange);
  }
};