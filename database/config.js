var mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect('mongodb://localhost:27017/hospitalDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('BD online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

};


module.exports = {
    dbConnection
};