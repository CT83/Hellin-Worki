import annyang from 'annyang'

class Annyang {
    // 1
    isSupported() {
        return annyang !== null
    }

    // 2
    start() {
        if (annyang) {
            annyang.start()
            console.log("Annyang is now running!")
        }
    }

    // 3
    abort() {
        if (annyang) {
            annyang.abort()
        }
    }

    // 4
    resume() {
        if (annyang) {
            annyang.resume()
        }
    }

    // 5
    addCommands(commands) {
        if (annyang) {
            annyang.addCommands(
                commands
            )
        }
    }


    // 6
    addCallback(engineCallback, resultCallback) {
        if (annyang) {
            annyang.addCallback('start', event => engineCallback('on'))
            annyang.addCallback('soundstart', event => engineCallback('listening'))
            annyang.addCallback('end', event => engineCallback('off'))
            annyang.addCallback('error', event => engineCallback(event.error))
            annyang.addCallback('errorNetwork', event => engineCallback('network error'))
            annyang.addCallback('errorPermissionBlocked', event => engineCallback('permission blocked'))
            annyang.addCallback('errorPermissionDenied', event => engineCallback('permission denied'))
            annyang.addCallback('result', event => resultCallback(event))
        }
    }
}

// 7
export default new Annyang()