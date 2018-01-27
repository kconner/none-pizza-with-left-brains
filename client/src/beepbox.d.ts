declare namespace beepbox {
    class Synth {
        constructor(song: string)
        setSong(song: string): void
        snapToStart(): void
        play(): void
        pause(): void
    }
}
