const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000; 
const userRoute = require('./routes/UserRoute');

app.use(bodyParser.json());

app.use('/user', userRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

