import express from 'express'

const app = express()

app.get('/health', (req, res) => {
    res.sendStatus(200)
})

app.listen(3000, () => {
    console.log('App listening on port 3000!')
})