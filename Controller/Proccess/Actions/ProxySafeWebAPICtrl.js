const BlackList = async (body, url, res = { status: 500, result: false }) => {
  const params = '/safeWeb/blackList'

  const request = await fetch(url + params, {
    method: 'POST',
    body: JSON.stringify(body.blackList),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}

const WhiteList = async (body, url, res = { status: 500, result: false }) => {
  const params = '/safeWeb/whiteList'

  const request = await fetch(url + params, {
    method: 'POST',
    body: JSON.stringify(body.whiteList),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}

const KeyWords = async (body, url, res = { status: 500, result: false }) => {
  const params = '/safeWeb/keyWords'

  const request = await fetch(url + params, {
    method: 'POST',
    body: JSON.stringify(body.keyWords),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}

const Preferences = async (body, url, res = { status: 500, result: false }) => {
  const params = '/safeWeb/preferences'

  const request = await fetch(url + params, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const response = await request.json()
  res.status = request.status
  res.send = response
  return res
}

module.exports = { BlackList, WhiteList, KeyWords, Preferences }
