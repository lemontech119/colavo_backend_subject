import { Test, TestingModule } from '@nestjs/testing';
import { DayTimeTableService } from './day-time-table.service';
import { EventService } from '../event/event.service';
import { WorkhourService } from '../workhour/workhour.service';

describe('DayTimeTableService', () => {
  let service: DayTimeTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayTimeTableService, EventService, WorkhourService],
    }).compile();

    service = module.get<DayTimeTableService>(DayTimeTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnixTimeByDateAndInterval', () => {
    test('isIgnoreWorkhour true인 interval 값 상관없이 unixTime 정상 반환 확인', () => {
      const workUnitTime = service.getUnixTimeByDateAndInterval(
        '20230501',
        36900,
        true,
        0,
        false,
        'Asia/Seoul',
      );

      expect(workUnitTime).toEqual(1682866800);
    });

    test('isIgnoreWorkhour false인 interval값 더해진 unixTime 정상 반환 확인', () => {
      const workUnitTime = service.getUnixTimeByDateAndInterval(
        '20230501',
        36900,
        false,
        0,
        false,
        'Asia/Seoul',
      );

      expect(workUnitTime).toEqual(1682903700);
    });
  });

  describe('generateTimeSlotsByWorkTime', () => {
    test('workTime이 총 10이고 interval이 5분이면 2개의 timeSlot이 반환된다.', () => {
      const workStartUnixTime = 0;
      const workEndUnixTime = 10;
      const timeslotInterval = 5;
      const serviceDuration = 5;

      const timeSlots = service.generateTimeSlotsByWorkTime(
        workStartUnixTime,
        workEndUnixTime,
        timeslotInterval,
        serviceDuration,
      );

      expect(timeSlots.length).toEqual(2);
    });

    test('workTime이 총 35이고 interval이 10분이며 serviceDuration이 5인 경우 4개의 timeSlot이 반환된다.', () => {
      const workStartUnixTime = 0;
      const workEndUnixTime = 35;
      const timeslotInterval = 10;
      const serviceDuration = 5;

      const timeSlots = service.generateTimeSlotsByWorkTime(
        workStartUnixTime,
        workEndUnixTime,
        timeslotInterval,
        serviceDuration,
      );

      expect(timeSlots.length).toEqual(4);
    });

    test('workTime이 총 35이고 interval이 10분이며 serviceDuration이 10인 경우 3개의 timeSlot이 반환된다.', () => {
      const workStartUnixTime = 0;
      const workEndUnixTime = 35;
      const timeslotInterval = 10;
      const serviceDuration = 10;

      const timeSlots = service.generateTimeSlotsByWorkTime(
        workStartUnixTime,
        workEndUnixTime,
        timeslotInterval,
        serviceDuration,
      );

      expect(timeSlots.length).toEqual(3);
    });
  });
});
