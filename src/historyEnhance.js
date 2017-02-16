let prevState = {
  msg: null
}

const enhanceV4 = history => ({
  ...history,
  push (path, state = prevState) {
    const r = history.push(path, state)
    prevState.msg = state.msg
    return r
  }
})

const enhanceV3 = history => ({
  ...history,
  push (input) {
    const newInput = typeof input === 'string' ? { pathname: input, state: prevState } : input
    const r = history.push(newInput)
    prevState.msg = (newInput.state || prevState).msg
    return r
  }
})

export default function historyEnhance (history, version) {
  const enhance = version === 3 ? enhanceV3 : enhanceV4
  return enhance(history)
}
