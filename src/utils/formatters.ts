import moment from 'moment-timezone';

moment.locale('en');

export const formatDate = (date: Date) => {
  return moment(date || 0).format('D/M HH:MM');
};

export const formatLongDate = (date: Date) => {
  return moment(date || 0).format('D/MM/Y, HH:MM');
};

export const formatTime = (date: number) => {
  return moment(new Date(date)).utc().format('HH:mm');
};

export const toMinutes = (numberInMill: number) => {
  return moment(numberInMill || 0).format('MM');
};

export const formatKMs = (meters: number) => {
  return `${(meters / 1000).toFixed(1)}km`;
};

export const titlecase = (str: string) => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const clearName = (str: string) =>
  str.replace(/[^a-zA-Z\u0590-\u05fe ]/g, '');
