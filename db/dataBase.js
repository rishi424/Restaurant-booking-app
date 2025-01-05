const mongoose= require("mongoose")

const db=()=>{
    mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 60000, // Increase connection timeout to 60 seconds
        socketTimeoutMS: 60000,  // Increase socket timeout to 60 seconds
      })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}

module.exports=db