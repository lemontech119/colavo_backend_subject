import { Injectable } from '@nestjs/common';
import * as jsonfile from 'jsonfile';
import { Workhour } from './entities/workhour.entity';
import {
  getDayByDateAndTimezone,
  getDateByAddDays,
  getDateByDay,
} from '../../utils/date.util';

@Injectable()
export class WorkhourService {
  private readonly FILE_PATH = './json/workhours.json';

  async findAll(): Promise<Workhour[]> {
    return await jsonfile.readFile(this.FILE_PATH);
  }

  async findWorkhourByDaysAndTimeZone(
    days: number,
    startDayIdentifier: string,
    timeZone: string,
  ): Promise<Workhour[]> {
    const workHourList: Workhour[] = [];
    const workhours = await this.findAll();
    const weekdays = this.getWeekdaysByStartDayAndTimeZoneAndDays(
      startDayIdentifier,
      timeZone,
      days,
    );

    weekdays.map((weekday) => {
      workhours.map((workhour) => {
        if (workhour.weekday === weekday) {
          workHourList.push(workhour);
        }
      });
    });

    return workHourList;
  }

  getWeekdaysByStartDayAndTimeZoneAndDays(
    startDayIdentifier: string,
    timeZone: string,
    days: number,
  ): number[] {
    const weekdays = [];
    for (let i = 0; i < days; i++) {
      const date = getDateByAddDays(getDateByDay(startDayIdentifier), i);
      const day = getDayByDateAndTimezone(date, timeZone);

      weekdays.push(day + 1);
    }

    return weekdays;
  }
}
