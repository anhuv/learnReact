const mongoose = require('mongoose');

const conectDB =  () => {
    try{
        mongoose.connect("mongodb+srv://admin:admin@cluster0.b4o1j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        ,{
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
            'useCreateIndex':true
        });
        console.log("conected");
    }
    catch(e){
        console.log("error db ",e.message);
    }
    
}
module.exports = {
    conectDB,
}