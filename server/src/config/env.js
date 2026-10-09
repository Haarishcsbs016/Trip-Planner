const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const optional = ['OPENAI_API_KEY', 'GOOGLE_MAPS_API_KEY', 'OPENWEATHER_API_KEY'];
  const missing = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\nPlease configure your .env file. See .env.example for reference.');
    process.exit(1);
  }

  optional.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`⚠️  Optional env var not set: ${key} — related features will be limited/mocked.`);
    }
  });

  console.log('✅ Environment variables validated.');
};

module.exports = validateEnv;
