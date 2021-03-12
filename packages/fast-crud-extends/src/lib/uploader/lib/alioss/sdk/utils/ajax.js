export default function ajax (url, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      async = true,
      data = null,
      headers = {},
      method = 'get',
      timeout = 0
    } = options

    const xhr = new XMLHttpRequest()

    xhr.open(method, url, async)

    let timerId

    if (timeout) {
      timerId = setTimeout(() => {
        reject(new Error(`the request timeout ${timeout}ms`))
      }, timeout)
    }

    xhr.onerror = () => {
      reject(new Error('unknown error'))
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (timeout) clearTimeout(timerId)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response, xhr)
        } else {
          const err = new Error('the request is error')
          reject(err)
        }
      }
    }

    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })

    try {
      xhr.send(data)
    } catch (err) {
      reject(err)
    }
  })
}
