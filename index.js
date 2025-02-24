import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}
))
app.use(express.static('dist'))
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

let notes = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
    response.json(notes)
})
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p>
    <p>${new Date()}</p>`)
}
)
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
}
)
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
}
)
app.post('/api/persons', (request, response) => {
    let note = request.body
    note.id = Math.floor(Math.random() * 10000)
    if(!note.name || !note.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if(notes.find(n => n.name === note.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    notes = notes.concat(note)
    response.json(note)
}
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})