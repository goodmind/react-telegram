import TeleBot from 'telebot'
import invariant from 'invariant'
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
    this.history = history
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
      if (!this.history.getCurrentLocation) {
        this.history.push(url, { data, msg })
      } else {
        this.history.push({
          pathname: url,
          state: { data, msg }
        })
      }
    })
  }
}

export { Screen } from './api'
