import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { ITimeslot } from '../../interfaces/dayTimeTable.inter';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAvailableTimeSlot', () => {
    test('예약이 시작 시간보다 뒤에 있으면서, 예약이 끝 시간보다 이하인 있는 경우 false 반환', () => {
      const eventData: Event[] = [
        {
          begin_at: 10,
          end_at: 20,
          created_at: 1620272253,
          updated_at: 1620272253,
        },
      ];
      const timeSlotData = {
        begin_at: 11,
        end_at: 19,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(false);
    });

    test('예약이 시작 시간보다 뒤에 있으면서, 예약이 끝 시간보다 뒤에 있는 경우 false 반환', () => {
      const eventData: Event[] = [
        {
          begin_at: 10,
          end_at: 20,
          created_at: 1620272253,
          updated_at: 1620272253,
        },
      ];
      const timeSlotData = {
        begin_at: 11,
        end_at: 21,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(false);
    });

    test('예약이 시작 시간보다 앞에 있으면서, 예약이 끝 시간보다 뒤에 있는 경우 false 반환', () => {
      const eventData: Event[] = [
        {
          begin_at: 10,
          end_at: 20,
          created_at: 1620272253,
          updated_at: 1620272253,
        },
      ];
      const timeSlotData = {
        begin_at: 9,
        end_at: 21,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(false);
    });

    test('예약이 시작 시간과 끝 시간 사이에 있는 경우 false 반환', () => {
      const eventData: Event[] = [
        {
          begin_at: 10,
          end_at: 20,
          created_at: 1620272253,
          updated_at: 1620272253,
        },
      ];
      const timeSlotData = {
        begin_at: 11,
        end_at: 19,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(false);
    });

    test('예약이 없는 경우 true 반환', () => {
      const eventData: Event[] = [];

      const timeSlotData = {
        begin_at: 1620262800,
        end_at: 1620264600,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(true);
    });

    test('예약 목록에 겹치는 시간이 없으면 true 반환 확인', () => {
      const eventData: Event[] = [
        {
          begin_at: 1620268200,
          end_at: 1620275400,
          created_at: 1620272253,
          updated_at: 1620272253,
        },
      ];
      const timeSlotData = {
        begin_at: 1620262800,
        end_at: 1620264600,
      };
      const isAvailableTimeSlot = service.isAvailableTimeSlot(
        timeSlotData,
        eventData,
      );

      expect(isAvailableTimeSlot).toEqual(true);
    });
  });
});
