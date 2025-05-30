const express = require('express');
const app = express();
const mongoConnect = require('./config/mongo.connect');
const adminRoutes = require('./routes/admin.routes');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors')

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoConnect();

app.use('/api/v1', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});