import { Body, Controller, Post } from '@nestjs/common';
import { DayTimeTableService } from './day-time-table.service';
import { RequestBody } from './dto/RequestBody.dto';

@Controller('day-time-table')
export class DayTimeTableController {
  constructor(private readonly dayTimeTableService: DayTimeTableService) {}

  @Post('/getTimeSlots')
  findTimeTable(@Body() requestBody: RequestBody) {
    return this.dayTimeTableService.findDayTimeTables(
      requestBody.start_day_identifier,
      requestBody.timezone_identifier,
      requestBody.service_duration,
      requestBody.days || 1,
      requestBody.timeslot_interval || 30,
      requestBody.is_ignore_schedule || false,
      requestBody.is_ignore_workhour || false,
    );
  }
}
