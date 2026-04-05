const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // Check if user is using the placeholder still
    if (!uri || uri.includes('<YOUR_CLUSTER_URL>')) {
      console.log('Detected placeholder MongoDB URL. Spinning up local In-Memory Database to run the app seamlessly...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Local In-Memory MongoDB running at ' + uri);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
