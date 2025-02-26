import mongoose from 'mongoose'

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://baozhu:${password}@cluster0.kock2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const People = mongoose.model('People', peopleSchema)

if(process.argv.length === 3) {
    console.log('phonebook:')
    People.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}else if(process.argv.length === 5) {
    const people = new People({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    people.save().then(() => {
      console.log(`added ${people.name} number ${people.number} to phonebook`)
      mongoose.connection.close()
    })
}