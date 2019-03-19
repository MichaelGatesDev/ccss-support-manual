const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ccss-support-manual-TEST', { useNewUrlParser: true });
mongoose.connection
    .once('open', () => console.log('Connected to database!'))
    .on('error', (error) => {
        console.warn('Error in database: ', error);
    });

//Called hooks which runs before something.
beforeEach((done) => {
    mongoose.connection.collections.buildings.drop(() => {
        //this function runs after the drop is completed
        done(); //go ahead everything is done now.
    });
});

// https://medium.com/nongaap/beginners-guide-to-writing-mongodb-mongoose-unit-tests-using-mocha-chai-ab5bdf3d3b1d