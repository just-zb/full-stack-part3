import { set, connect, Schema, model } from 'mongoose'
set('strictQuery', false)
const url = process.env.MONGODB_URI
if (url === undefined) {
  console.log('MONGODB_URI is not defined')
  process.exit(1)
}
connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new Schema({
name: {
    type: String,
    required: true,
    minlength: 3,
},
number: {
    type: String,
    required: true,
    minlength: 8,
    validate:{
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
    },
    message : props => `${props.value} is not a valid phone number!`
  }
}
})
personSchema.set('toJSON', {
transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}
})
export default model('Person', personSchema)
