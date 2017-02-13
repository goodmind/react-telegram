import { Message } from './widgets/Message'
import { InlineKeyboardMarkup } from './widgets/InlineKeyboardMarkup'
import { InlineButton } from './widgets/InlineButton'

export class Screen {
  constructor (bot) {
    this.__telegram_screen = true
    this.bot = bot
    this.children = []
  }

  renderMessage (msg) {
    const markup = msg.children[0]
    return this.bot.sendMessage(msg.to.id, msg.content, { markup: this.renderNode(markup) }).then(({ result: m }) => {
      this.bot.callbackStorage[m.message_id] = (cb) => {
        const btn = markup.children[0]
        btn.emit('event', 'click', {
          button: 0,
          defaultPrevented: false,
          preventDefault: () => {}
        })
      }
    })
  }

  renderNode (node) {
    if (node instanceof Message) {
      return this.renderMessage(node)
    }
    if (node instanceof InlineKeyboardMarkup) {
      return this.bot.inlineKeyboard([
        node.children.map(this.renderNode, this)
      ])
    }
    if (node instanceof InlineButton) {
      return this.bot.inlineButton('Command button', { callback: '/hello' })
    }
    return undefined
  }

  append (node) {
    node.parent = this
    this.children.push(node)
  }

  remove (node) {
    if (node.parent !== this) return
    const i = this.children.indexOf(node)
    if (!~i) return

    node.parent = null
    this.children.splice(i, 1)
  }

  render (...args) {
    const node = this.children[0]
    return this.renderNode(node)
  }
}

export { widgets } from './widgets'

