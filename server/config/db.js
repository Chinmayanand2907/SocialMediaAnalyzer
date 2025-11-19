const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const isAtlas = process.env.MONGO_URI?.includes('mongodb.net') || process.env.MONGO_URI?.includes('atlas');
      
      const options = {
        serverSelectionTimeoutMS: isAtlas ? 10000 : 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
      };

      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      
      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected successfully');
      });

      return conn;
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      
      // Provide helpful error messages
      if (error.message.includes('IP') || error.message.includes('whitelist')) {
        console.error('\n❌ MongoDB Atlas IP Whitelist Error');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Your IP address is not whitelisted in MongoDB Atlas.');
        console.error('\n📋 To fix this:');
        console.error('1. Go to: https://cloud.mongodb.com/');
        console.error('2. Navigate to: Network Access → IP Access List');
        console.error('3. Click "Add IP Address"');
        console.error('4. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
        console.error('   OR add your current IP address');
        console.error('5. Wait 1-2 minutes for changes to take effect');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } else if (error.message.includes('authentication')) {
        console.error('\n❌ MongoDB Authentication Error');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Invalid username or password in connection string.');
        console.error('Please check your MONGO_URI in the .env file.');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('\n❌ MongoDB Connection Error');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Cannot resolve MongoDB hostname.');
        console.error('Please check your MONGO_URI connection string.');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } else {
        console.error(`\n❌ MongoDB Connection Error (Attempt ${i + 1}/${retries})`);
        console.error('Error:', error.message);
      }

      if (isLastAttempt) {
        console.error('\n❌ Failed to connect to MongoDB after', retries, 'attempts');
        console.error('Please check:');
        console.error('1. MongoDB server is running (if using local MongoDB)');
        console.error('2. Connection string in .env file is correct');
        console.error('3. Network connectivity');
        console.error('4. IP whitelist (if using MongoDB Atlas)');
        console.error('\nExiting application...\n');
        process.exit(1);
      } else {
        console.log(`⏳ Retrying connection in ${delay / 1000} seconds... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

module.exports = connectDB;

