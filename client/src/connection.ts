import * as Colyseus from 'colyseus.js'

export default class Connection {
    private client: Colyseus.Client
    private room: Colyseus.Room

    constructor(serverURL: string, onDisconnect: () => void) {
        this.client = new Colyseus.Client(serverURL)
        this.client.onError.add(() => {
            console.error(`Connection.onError`, serverURL)
            const anyClient = this.client as any
            anyClient.connection.close()
        })
        this.room = this.client.join('GameRoom')
        this.room.onLeave.addOnce(onDisconnect)
        this.client.onClose.addOnce(onDisconnect)
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

        const anyClient = this.client as any
        anyClient.connection.close()

        this.room = null
        this.client = null
    }
}
