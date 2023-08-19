const xhr = new XMLHttpRequest()
xhr.open('get', '/api/user', true)
xhr.onload = function change() {
  console.log(xhr.response)
}
xhr.send()
