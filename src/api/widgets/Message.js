import { Widget } from './Widget'

export class Message extends Widget {
  constructor (props) {
    super(props)
    this.to = props.to
  }
}
