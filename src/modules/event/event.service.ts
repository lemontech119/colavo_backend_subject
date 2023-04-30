import { Injectable } from '@nestjs/common';
import * as jsonfile from 'jsonfile';
import { Event } from './entities/event.entity';
import { IDayTimeTable, ITimeslot } from '../../interfaces/dayTimeTable.inter';

@Injectable()
export class EventService {
  private readonly FILE_PATH = './json/events.json';

  async findAll(): Promise<Event[]> {
    return await jsonfile.readFile(this.FILE_PATH);
  }

  isAvailableTimeSlot(timeslot: ITimeslot, events: Event[]): boolean {
    let isAvailable = true;

    events.forEach((event) => {
      if (
        (event.begin_at <= timeslot.begin_at &&
          event.end_at >= timeslot.begin_at) ||
        (event.begin_at <= timeslot.end_at &&
          event.end_at >= timeslot.end_at) ||
        (event.begin_at >= timeslot.begin_at && event.end_at <= timeslot.end_at)
      ) {
        isAvailable = false;
      }
    });

    return isAvailable;
  }

  async removeReservedTimeSlots(dayTimeTables: IDayTimeTable[]): Promise<void> {
    const events = await this.findAll();

    dayTimeTables.forEach((dayTimeTable) => {
      dayTimeTable.timeslots = dayTimeTable.timeslots.filter((timeslot) => {
        return this.isAvailableTimeSlot(timeslot, events);
      });
    });
  }
}
