import { Message } from './widgets/Message'
import { InlineKeyboardMarkup } from './widgets/InlineKeyboardMarkup'
import { InlineButton } from './widgets/InlineButton'

export class Screen {
  constructor (bot) {
    this.__telegram_screen = true
    this.bot = bot
    this.children = []
    this.msg = null
  }

  async send (chatId, text, opts = {}) {
    let m
    if (this.msg) {
      const o = { chatId, messageId: this.msg.message_id }
      await this.bot.editText(o, text)
      m = await this.bot.editMarkup(o, opts.markup)
    } else {
      m = await this.bot.sendMessage(chatId, text, opts)
    }
    this.msg = m.result
    return m
  }

  async renderMessage (msg) {
    const markup = msg.children[0]

    if (markup) {
      const { result: m } = await this.send(msg.to.id, msg.content, { markup: this.renderNode(markup) })
      this.bot.callbackStorage[m.message_id] = cb => {
        const btn = markup.children[0]
        const event = {
          button: 0,
          defaultPrevented: false,
          preventDefault: () => {}
        }
        btn.emit('event', 'click', event)
      }
      return m
    }

    return this.send(msg.to.id, msg.content)
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
      return this.bot.inlineButton(node.content, { callback: '/hello' })
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

