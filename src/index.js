import TeleBot from 'telebot'
import invariant from 'invariant'
import historyEnhance from './historyEnhance'
import { render } from './renderer/render'

const splitIn = str => str.indexOf(' ') !== -1 ? [
  str.substr(0, str.indexOf(' ')),
  str.substr(str.indexOf(' ') + 1)
] : [str]

export class Telegram extends TeleBot {
  constructor (options) {
    super(options)
    this.callbackStorage = {}
    this.render = render
    this.registerCallbacks()
  }

  registerCallbacks () {
    this.on('callbackQuery', cb => {
      const callback = this.callbackStorage[cb.message.message_id]
      if (callback) callback(cb)
    })
  }

  pushHistory (history, url, state) {
    if (!history.getCurrentLocation) {
      history.push(url, state)
    } else {
      history.push({
        pathname: url,
        state
      })
    }
  }

  useHistory (history) {
    invariant(
      history !== undefined,
      'Telegram: You must pass a valid History.'
    )

    history = historyEnhance(history, history.getCurrentLocation ? 3 : 4)
    this.on('/*', msg => {
      const [url, data] = splitIn(msg.text)
      const state = { data, msg, new: true }
      this.pushHistory(history, url, state)
    })

    return history
  }
}

export { Screen } from './api'
