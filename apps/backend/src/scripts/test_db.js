require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
