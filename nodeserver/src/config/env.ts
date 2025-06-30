import dotenv from 'dotenv';

dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;
