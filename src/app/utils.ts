import {isFunction} from 'lodash-es';

export function resolveFunction<T>(
  v: T | ((...args: unknown[]) => T),
  ...args: unknown[]
): T {
  while (isFunction(v)) v = v(...args);
  return v;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// credits: adapted from https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form

export function millisToStr(milliseconds: number): string {
  function numberEnding(number: number) {
    return number > 1 ? 's' : '';
  }

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) return years + ' year' + numberEnding(years);

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) return days + ' day' + numberEnding(days);

  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) return hours + ' hour' + numberEnding(hours);

  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) return minutes + ' minute' + numberEnding(minutes);

  const seconds = temp % 60;
  if (seconds) return seconds + ' second' + numberEnding(seconds);

  return 'less than a second';
}
