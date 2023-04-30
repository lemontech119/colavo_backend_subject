import { Test, TestingModule } from '@nestjs/testing';
import { DayTimeTableController } from './day-time-table.controller';
import { DayTimeTableService } from './day-time-table.service';
import { EventService } from '../event/event.service';
import { WorkhourService } from '../workhour/workhour.service';

describe('DayTimeTableController', () => {
  let controller: DayTimeTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayTimeTableController],
      providers: [DayTimeTableService, EventService, WorkhourService],
    }).compile();

    controller = module.get<DayTimeTableController>(DayTimeTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
