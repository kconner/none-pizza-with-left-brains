import * as Colyseus from 'colyseus.js'

export default class Connection {
    private client: Colyseus.Client
    private room: Colyseus.Room

    constructor(serverURL: string, onDisconnect: () => void) {
        this.client = new Colyseus.Client(serverURL)
        this.room = this.client.join('GameRoom')
        this.room.onLeave.addOnce(onDisconnect)
    }

    id(): string {
        return this.room.sessionId
    }

    data(): GameState {
        return this.room.data
    }

    send(message: any) {
        if (this.room.connection) {
            this.room.send(message)
        }
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
