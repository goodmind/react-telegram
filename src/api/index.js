export class Screen {
  constructor () {
    this.__telegram_screen = true
    this.children = []
  }

  append (node) {
    this.children.push(node)
  }

  render (...args) {
    console.log('Rendering...')
    console.log(this.children[0])
  }
}

export { widgets } from './widgets'

