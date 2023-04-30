export interface ITimeslot {
  begin_at: number;
  end_at: number;
}

export interface IDayTimeTable {
  start_of_day: number;
  day_modifier: number;
  is_day_off: boolean;
  timeslots: ITimeslot[];
}
