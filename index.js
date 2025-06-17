const express=require('express');
const { default: mongoose } = require('mongoose');
const { MONGO_URI } = require('./keys');
const app=express();
const PORT=3200;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/test',(req,res)=>{
    res.send("Hello World");
});
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Database Connected Successfully by the Server") 
})
app.use(require('./controllers/auth.js'))
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});