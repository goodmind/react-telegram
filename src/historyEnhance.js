let prevState

const enhanceV4 = history => ({
  ...history,
  push (path, state = prevState) {
    const r = history.push(path, state)
    prevState = state
    return r
  }
})

const enhanceV3 = history => ({
  ...history,
  push (input) {
    const newInput = typeof input === 'string' ? { pathname: input, state: prevState } : input
    const r = history.push(newInput)
    prevState = newInput.state || prevState
    return r
  }
})

export default function historyEnhance (history, version) {
  const enhance = version === 3 ? enhanceV3 : enhanceV4
  return enhance(history)
}
