const mongoose = require("mongoose");
require('dotenv');
mongoose.connect("mongodb+srv://adminchatapp:fOdPrVZWwdCpqTLi@cluster0.nt431ty.mongodb.net/chat-app?retryWrites=true&w=majority",  {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
})