import { Module } from '@nestjs/common';
import { WorkhourService } from './workhour.service';

@Module({
  providers: [WorkhourService],
  exports: [WorkhourService],
})
export class WorkhourModule {}
