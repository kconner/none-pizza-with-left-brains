import * as Colyseus from 'colyseus.js'

export default class Connection {
    private client: Colyseus.Client
    private room: Colyseus.Room

    constructor(serverURL: string) {
        this.client = new Colyseus.Client(serverURL)
        this.room = this.client.join('GameRoom')
    }

    id(): string {
        return this.client.id
    }

    data(): GameState {
        return this.room.data
    }

    send(message: any) {
        this.room.send(message)
    }

    listen(segments: string, callback: (change: any) => void) {
        this.room.listen(segments, callback)
    }

    destroy() {
        this.room.leave()
        this.room = null
        this.client = null
    }
}
