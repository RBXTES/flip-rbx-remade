const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const http = require('http')
const { Server } = require('socket.io')
const accountController = require('./controllers/accountController')
const dotenv = require('dotenv')
const cron = require('node-cron')
const port = process.env.PORT
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const compression = require("compression");

dotenv.config()

const app = express();
app.set('trust proxy', 1)
app.use(cors())

const mongoose = require('mongoose')
const coinflip = require('./models/coinflip')
const item = require('./models/item')
const { addMinutes } = require("date-fns");

mongoose.set('strictQuery', "false")
const dev_db = 'mongodb+srv://admin:admin@cluster0.2up1wdk.mongodb.net/?retryWrites=true&w=majority'
const mongoDB = dev_db || process.env.MONGODB_URI

main().catch(err => console.log(err))
async function main() {
  mongoose.connect(mongoDB)
}

const httpServer = http.createServer(app)



const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 125,
});

const socketLimiter = new RateLimiterMemory({
  points: 5,
  duration: 3
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

httpServer.listen(port, () => {
  console.log(`listening on ${port}`)
})

cron.schedule('0 0 * * *', async () => {
  const response = await fetch('https://api.rolimons.com/items/v1/itemdetails')
  const convertedResponse = await response.json()
  if (convertedResponse.success == false) {
    return console.log('Item Update Failed')
  }
  let data = Object.entries(convertedResponse.items)
  let newArrayItems = []
  for (dataItem of data) {
    const newItem = {
      itemId: dataItem[0],
      itemName: dataItem[1][0],
      value: dataItem[1][4]
    }
    newArrayItems.push(newItem)
  }
  await item.deleteMany({})
  await item.insertMany(newArrayItems)
  console.log('Updated Items')
})

let tempMessageStore = []

io.engine.use(helmet())
io.engine.use(compression())

io.on('connection', async (socket) => {
  socket.on('bcast', async (data) => {
    try {
      await socketLimiter.consume(socket.handshake.address); // consume 1 point per event from IP
      socket.emit('news', { 'data': data });
      socket.broadcast.emit('news', { 'data': data });
    } catch(rejRes) {
      // no available points to consume
      // emit error or warning message
      socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
    }
  });
  if (tempMessageStore.length > 0) {
    socket.emit('LOAD_MESSAGES', tempMessageStore)
  }
  const loadCoinflips = await coinflip.find({}, { serverSeed: 0 }).sort({ value: -1 })
  socket.emit('NEW_COINFLIP', loadCoinflips)
  socket.on('NEW_COINFLIP', async () => {
    const activeCoinflips = await coinflip.find({}, { serverSeed: 0 }).sort({ value: -1 })
    io.emit('NEW_COINFLIP', activeCoinflips)
  })
  socket.on('COINFLIP_UPDATE', async (id) => {
    const newData = await coinflip.findOne({ _id: id })
    if (newData.winnerCoin != null) {
      io.emit('COINFLIP_UPDATE', await coinflip.findOne({ _id: id }))
      io.emit('NEW_COINFLIP', await coinflip.find({}, { serverSeed: 0 }).sort({ value: -1 }))
    }
  })
  io.emit('USER_COUNT', io.engine.clientsCount)
  socket.on('SEND_MESSAGE', async (data) => {
    const sender = await accountController.getUserData(data.author)
    if (sender == null) return
    const response = {
      author: {
        username: sender.username,
        role: sender.role,
        avatarId: sender.avatarId
      },
      message: data.message,
      date: new Date()
    }
    if (tempMessageStore.length > 40) {
      tempMessageStore.shift()
    }
    tempMessageStore.push(response)
    io.emit('NEW_MESSAGE', response)
  })
  socket.on('BALANCE_UPDATE', async (user) => {
    const newBalance = await accountController.getUserData(user)
    if (newBalance != undefined) {
      socket.emit('BALANCE_UPDATE', newBalance.balance)
    }
  })
})

cron.schedule('* * * * *', async () => { 
  await coinflip.deleteMany({ endedAt: { $lt: new Date().getTime() - 90000 }})
    .then(console.log('Deleted Finished Flips'))
  io.emit('NEW_COINFLIP', await coinflip.find({}, { serverSeed: 0 }).sort({ value: -1 }))
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/socket.io/', limiter);
app.use(compression())
app.use(limiter)
app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
