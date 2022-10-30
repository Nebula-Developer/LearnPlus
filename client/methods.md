Current methods: (userscript)

Get request jquery/socket.io from server, then save dat to a new function (returning custom names to avoid override)

```js
function get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // False for synchronous req
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
```