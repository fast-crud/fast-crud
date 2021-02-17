let debug = () => {}
let info = () => {}
let error = () => {}
let warn = () => {}
function getCallerInfo () {
  const e = new Error()
  return e.stack.split('\n')[3]
}
if (process.env.NODE_ENV !== 'production') {
  if (process.env.VUE_APP_FS_LOG_DEBUG === 'true') {
    debug = (...args) => {
      const callerInfo = getCallerInfo()
      if (process.env.VUE_APP_FS_LOG_WITH_CALLER === 'true') {
        console.log('[debug]', ...args, '\n', callerInfo)
      } else {
        console.log('[debug]', ...args)
      }
    }
  }
  if (process.env.VUE_APP_FS_LOG_INFO !== 'false') {
    info = (...args) => {
      console.log('[info]', ...args)
    }
  }
  warn = (...args) => {
    console.warn('[warn]', ...args)
  }
  error = (...args) => {
    console.error('[error]', ...args)
  }
}

export default {
  debug, info, error, warn
}
