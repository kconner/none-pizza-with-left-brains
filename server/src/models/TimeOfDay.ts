export class TimeOfDay {
    lengthOfDay: number = 60
    hour: number = 30
    realTime: number = Date.now() / 1000;
    lastTimeUpdated: number = Date.now() / 1000;
    dayOrNight: DayOrNight = 'Day'
}
