import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestBody {
  @IsString()
  start_day_identifier: string;

  @IsString()
  timezone_identifier: string;

  @IsNumber()
  service_duration: number;

  @IsOptional()
  @IsNumber()
  days?: number;

  @IsOptional()
  @IsNumber()
  timeslot_interval?: number;

  @IsOptional()
  @IsBoolean()
  is_ignore_schedule?: boolean;

  @IsOptional()
  @IsBoolean()
  is_ignore_workhour?: boolean;
}
