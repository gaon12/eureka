const express = require('express');
const cors = require('cors');

const userRouter = require('./user/user');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.static(__dirname + '/static'));
app.use('/user', userRouter);

app.listen(app.get('port'),() => {
    console.log('Express server listening on port ' + app.get('port'));
});