export class TimeOfDay {
    static lengthOfDayInSeconds: number = 60
    dayCountdownInSeconds: number = 30
    currentFrameTimestamp: number = Date.now() / 1000
    previousFrameTimestamp: number = Date.now() / 1000
    dayOrNight: DayOrNight = 'Day'
}
