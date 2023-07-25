const express = require('express');
const cors = require('cors');

const userRouter = require('./user/user.js');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.static(__dirname + '/react-project/build'));
app.use('/user', userRouter);

app.get("*", (req, res) => {
    res.sendFile("index.html");
});

app.listen(app.get('port'),() => {
    console.log('Express server listening on port ' + app.get('port'));
});