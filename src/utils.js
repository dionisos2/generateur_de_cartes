/* globals XMLHttpRequest */

export function getTextFromUrl (Url) {
  var req = new XMLHttpRequest()
  req.open('GET', Url, false)
  req.send(null)
  if (req.status === 200) {
    return req.responseText
  }
}

export function copy (x) {
  return null
}
