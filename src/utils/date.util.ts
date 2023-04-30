import * as moment from 'moment-timezone';

export const getDayByDateAndTimezone = (
  date: Date,
  timezone: string,
): number => {
  return moment(date).tz(timezone).day();
};

export const getDateByAddDays = (date: Date, addDays: number): Date => {
  return moment(date).add(addDays, 'days').toDate();
};

export const addDaysByUnixTime = (
  unixTime: number,
  addDays: number,
): number => {
  return moment.unix(unixTime).add(addDays, 'days').unix();
};

export const getDateByDay = (day: string, timeZone: string): Date => {
  return moment.tz(day, timeZone).toDate();
};

export const getUnixTimeByDate = (date: Date): number => {
  return moment(date).unix();
};
