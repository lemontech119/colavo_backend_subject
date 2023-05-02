import { Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { WorkhourService } from '../workhour/workhour.service';
import {
  getUnixTimeByDate,
  getDateByDay,
  getDateByAddDays,
  addDaysByUnixTime,
} from '../../utils/date.util';
import { Workhour } from '../workhour/entities/workhour.entity';
import { ITimeslot, IDayTimeTable } from '../../interfaces/dayTimeTable.inter';

@Injectable()
export class DayTimeTableService {
  constructor(
    private readonly eventService: EventService,
    private readonly workhourService: WorkhourService,
  ) {}

  getAddDayTargetUnixTimeByDayAndTimeZone(
    startDayIdentifier: string,
    addDays: number,
    timeZone: string,
  ): number {
    return getUnixTimeByDate(
      getDateByAddDays(getDateByDay(startDayIdentifier, timeZone), addDays),
    );
  }

  getUnixTimeByDateAndInterval(
    startDayIdentifier: string,
    interval: number,
    isIgnoreWorkhour: boolean,
    addDays: number,
    isEndTime: boolean,
    timeZone: string,
  ) {
    const targetUnixTime = this.getAddDayTargetUnixTimeByDayAndTimeZone(
      startDayIdentifier,
      addDays,
      timeZone,
    );

    if (isIgnoreWorkhour) {
      const addDay = isEndTime ? 1 : 0;
      return addDaysByUnixTime(targetUnixTime, addDay);
    }
    return targetUnixTime + interval;
  }

  generateTimeSlotsByWorkTime(
    workStartUnixTime: number,
    workEndUnixTime: number,
    timeslotInterval: number,
    serviceDuration: number,
  ): ITimeslot[] {
    const timeSlots: ITimeslot[] = [];
    for (
      let i = workStartUnixTime;
      i < workEndUnixTime;
      i += timeslotInterval
    ) {
      if (i + serviceDuration <= workEndUnixTime) {
        timeSlots.push({
          begin_at: i,
          end_at: i + timeslotInterval,
        });
      }
    }

    return timeSlots;
  }

  generateDayTimeTableByWorkHours(
    workHours: Workhour[],
    startDayIdentifier: string,
    timeslotInterval: number,
    isIgnoreWorkhour: boolean,
    serviceDuration: number,
    timeZone: string,
  ): IDayTimeTable[] {
    return workHours
      .map((workhour, index) => {
        const workStartUnixTime = this.getUnixTimeByDateAndInterval(
          startDayIdentifier,
          workhour.open_interval,
          isIgnoreWorkhour,
          index,
          false,
          timeZone,
        );
        const workEndUnixTime = this.getUnixTimeByDateAndInterval(
          startDayIdentifier,
          workhour.close_interval,
          isIgnoreWorkhour,
          index,
          true,
          timeZone,
        );
        const timeSlots =
          workStartUnixTime >= workEndUnixTime || workhour.is_day_off
            ? []
            : this.generateTimeSlotsByWorkTime(
                workStartUnixTime,
                workEndUnixTime,
                timeslotInterval,
                serviceDuration,
              );

        return {
          start_of_day: this.getAddDayTargetUnixTimeByDayAndTimeZone(
            startDayIdentifier,
            0,
            timeZone,
          ),
          day_modifier: index,
          is_day_off: workhour.is_day_off,
          timeslots: timeSlots,
        };
      })
      .filter(Boolean);
  }

  async findDayTimeTables(
    startDayIdentifier: string,
    timezoneIdentifier: string,
    serviceDuration: number,
    days: number,
    timeslotInterval: number,
    isIgnoreSchedule: boolean,
    isIgnoreWorkhour: boolean,
  ): Promise<IDayTimeTable[]> {
    const workHours = await this.workhourService.findWorkhourByDaysAndTimeZone(
      days,
      startDayIdentifier,
      timezoneIdentifier,
    );
    const dayTimeTables = this.generateDayTimeTableByWorkHours(
      workHours,
      startDayIdentifier,
      timeslotInterval,
      isIgnoreWorkhour,
      serviceDuration,
      timezoneIdentifier,
    );

    if (!isIgnoreSchedule) {
      await this.eventService.removeReservedTimeSlots(dayTimeTables);
    }

    return dayTimeTables;
  }
}
