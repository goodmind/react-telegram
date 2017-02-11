export class Widget {
  constructor (props) {
    this.content = null
    this.children = []
  }

  on (event, callback) {
    console.log(this)
  }

  setContent (text) {
    this.content = text
    console.log(this)
  }

  append (node) {
    this.children.push(node)
    console.log(this)
  }
}
