import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DayTimeTableModule } from './modules/day-time-table/day-time-table.module';
import { WorkhourModule } from './modules/workhour/workhour.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [DayTimeTableModule, WorkhourModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
