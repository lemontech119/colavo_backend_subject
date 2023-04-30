import { Test, TestingModule } from '@nestjs/testing';
import { WorkhourService } from './workhour.service';

describe('WorkhourService', () => {
  let service: WorkhourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkhourService],
    }).compile();

    service = module.get<WorkhourService>(WorkhourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeekdaysByStartDayAndTimeZoneAndDays', () => {
    test('20230501은 월요일이고 timezone이 Asia/Seoul, days가 1이면 [2]만 반환한다.', () => {
      const weekdays = service.getWeekdaysByStartDayAndTimeZoneAndDays(
        '20230501',
        'Asia/Seoul',
        1,
      );

      expect(weekdays).toEqual([2]);
    });

    test('20230501은 월요일이고 timezone이 Asia/Seoul, days가 3이면 [2,3,4]만 반환한다.', () => {
      const weekdays = service.getWeekdaysByStartDayAndTimeZoneAndDays(
        '20230501',
        'Asia/Seoul',
        3,
      );

      expect(weekdays).toEqual([2, 3, 4]);
    });
  });

  describe('findWorkhourByDaysAndTimeZone', () => {
    test('20230501은 월요일이고 timezone이 Asia/Seoul, days가 1이면 반환되는 배열의 index 0의 key의 value는 mon 이다.', async () => {
      const workhours = await service.findWorkhourByDaysAndTimeZone(
        1,
        '20230501',
        'Asia/Seoul',
      );

      expect(workhours[0].key).toEqual('mon');
    });
  });
});
