import { Body, Controller, Post } from '@nestjs/common';
import { DayTimeTableService } from './day-time-table.service';
import { RequestBody } from './dto/RequestBody.dto';

@Controller('day-time-table')
export class DayTimeTableController {
  constructor(private readonly dayTimeTableService: DayTimeTableService) {}

  @Post('/getTimeSlots')
  findTimeTable(@Body() requestBody: RequestBody) {
    const days =
      requestBody.days < 1 || !requestBody.days ? 1 : requestBody.days;

    return this.dayTimeTableService.findDayTimeTables(
      requestBody.start_day_identifier,
      requestBody.timezone_identifier,
      requestBody.service_duration,
      days,
      requestBody.timeslot_interval || 1800,
      requestBody.is_ignore_schedule || false,
      requestBody.is_ignore_workhour || false,
    );
  }
}
