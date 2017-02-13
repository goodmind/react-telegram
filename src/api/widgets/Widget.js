import { EventEmitter } from 'events'
export class Widget extends EventEmitter {
  constructor (props) {
    super()
    this.content = null
    this.children = []
    this.props = props
  }

  off (eventName, listener) {
    this.removeListener(eventName, listener)
  }

  setContent (text) {
    this.content = text
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

  destroy () {
    if (this.parent) this.parent.remove(this)
  }
}
