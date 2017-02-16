import TeleBot from 'telebot'
import invariant from 'invariant'
import historyEnhance from './historyEnhance'
import { render } from './renderer/render'

const splitIn = str => str.indexOf(' ') !== -1 ? [
  str.substr(0, str.indexOf(' ')),
  str.substr(str.indexOf(' ') + 1)
] : [str]

export class Telegram extends TeleBot {
  constructor (options, history) {
    super(options)
    invariant(
      history !== undefined,
      'Telegram: You must pass a valid History.'
    )

    this.callbackStorage = {}
    this.history = historyEnhance(history, history.getCurrentLocation ? 3 : 4)
    this.render = render
    this.registerCallbacks()
  }

  registerCallbacks () {
    this.on('callbackQuery', cb => {
      const callback = this.callbackStorage[cb.message.message_id]
      if (callback) callback(cb)
    })

    this.on('/*', msg => {
      const [url, data] = splitIn(msg.text)
      const state = { data, msg, new: true }
      if (!this.history.getCurrentLocation) {
        this.history.push(url, state)
      } else {
        this.history.push({
          pathname: url,
          state
        })
      }
    })
  }
}

export { Screen } from './api'
