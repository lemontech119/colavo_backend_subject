import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';

describe('DayTimeTableController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Step1', () => {
    test('start_day_identifier가 20210509인 경우 index 0의 start_of_day 1620486000 인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body[0].start_of_day).toEqual(1620486000);
    });

    test('days가 2인 경우 반환되는 dayTimetable의 length는 2인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 2,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body.length).toEqual(2);
    });

    test('timeslot_interval이 3600인 경우 반환되는 timeslots의 length는 24인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 3600,
          timeslot_interval: 3600,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body[0].timeslots.length).toEqual(24);
    });

    test('timeslot_interval이 3600이며, service_duration이 7200인 경우 반환되는 timeslots의 length는 23인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 7200,
          timeslot_interval: 3600,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body[0].timeslots.length).toEqual(23);
    });

    test('timezone_identifier가 Asia/Seoul와 America/New_York의 start_of_day 차이가 46800 나는지 확인', async () => {
      const dayTimetableSeoul = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      const dayTimetableNewYork = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: true,
          is_ignore_workhour: true,
          timezone_identifier: 'America/New_York',
        });

      expect(
        dayTimetableNewYork.body[0].start_of_day -
          dayTimetableSeoul.body[0].start_of_day,
      ).toEqual(46800);
    });
  });

  describe('Step2', () => {
    test('is_ignore_schedule가 false이며 20210509인 경우 timeslots의 길이가 20인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 1,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: false,
          is_ignore_workhour: true,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body[0].timeslots.length).toEqual(20);
    });
  });

  describe('Step3', () => {
    test('is_ignore_workhour가 false이며 20210509에서 days가 2인 경우 월요일 workhour에 timeslots이 빈배열인지 확인', async () => {
      const dayTimetable = await request(app.getHttpServer())
        .post('/day-time-table/getTimeSlots')
        .send({
          start_day_identifier: '20210509',
          days: 2,
          service_duration: 1800,
          timeslot_interval: 1800,
          is_ignore_schedule: false,
          is_ignore_workhour: false,
          timezone_identifier: 'Asia/Seoul',
        });

      expect(dayTimetable.body[1].timeslots).toEqual([]);
    });
  });
});
