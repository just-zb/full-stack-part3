import 'dotenv/config';
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'


const app = express()
app.use(express.json())
app.use(cors())

// log requests
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

// serve static files
app.use(express.static('dist'))

// handle root requests
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

// handle get all persons requests
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }
    )
})

// handle info requests
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
    }
    )
}
)

// handle get specific person requests
app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id).then(note => {
        response.json(note)
    }
    ).catch(error => {
        next(error)
    }
    )
}
)

// handle delete requests
app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }
    ).catch(error => {
        next(error)
    }
    )
}
)

// handle post requests
app.post('/api/persons', (request, response,next) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
}
)

// handle put requests
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person,{new: true,runValidators:true,context:"query"}).then(updatedPerson => {
        response.json(updatedPerson)
    }
    ).catch(error => next(error))
}
)

// handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// handle errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

// start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})