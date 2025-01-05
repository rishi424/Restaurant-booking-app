const mongoose= require("mongoose")

const db=()=>{
    mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}

module.exports=db