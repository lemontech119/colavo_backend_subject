import { Module } from '@nestjs/common';
import { DayTimeTableService } from './day-time-table.service';
import { DayTimeTableController } from './day-time-table.controller';
import { EventService } from '../event/event.service';
import { WorkhourService } from '../workhour/workhour.service';

@Module({
  controllers: [DayTimeTableController],
  providers: [DayTimeTableService, EventService, WorkhourService],
})
export class DayTimeTableModule {}
