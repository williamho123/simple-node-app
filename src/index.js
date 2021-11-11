const express = require('express')
const app = express()

const HOST = process.env.HOST || "0.0.0.0"
const PORT = process.env.PORT || 80

app.get('/', (req, res) => {
  console.log(`Request received ${new Date().toISOString()}`)
  res.json({
    "message"  : "Automate eveything!",
    "timestamp": Date.now()
  })
})

app.listen(PORT, HOST)
console.log(`Simple node app listening at http://${HOST}:${PORT}`)
