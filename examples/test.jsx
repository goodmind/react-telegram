import React from 'react'
import { Telegram, Screen } from '../lib'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import { Router, Route, Link } from 'react-router'

const App = ({ children }) => children
const Start = ({ location: { state } }) => {
  return (
    <message to={state.msg.from}>
      Hello, world!
      <inline-keyboard-markup>
        <Link to="/ping" /><Link to="/ping" /><Link to="/ping" />
        <Link to="/ping" /><Link to="/ping" /><Link to="/ping" />
        <Link to="/ping" /><Link to="/ping" /><Link to="/ping" />
      </inline-keyboard-markup>
    </message>
  )
}
const NoMatch = ({ location: { state } }) => (
  <message to={state.msg.from}>
    Unknown route
  </message>
)
const Pong = (props) => {
  return <message to={props.location.state.msg.from}>Pong</message>
}


const ACCESS_TOKEN = `ACCESS_TOKEN`
const history = createMemoryHistory()
history.listen((location, action) => {
  console.log(action, location.pathname, location.state)
})

const bot = new Telegram(ACCESS_TOKEN, history)

bot.connect()
bot.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="start" component={Start} />
      <Route path="ping" component={Pong} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
), new Screen(bot))

