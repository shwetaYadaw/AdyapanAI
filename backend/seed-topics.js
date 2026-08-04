const axios = require('axios');

const seedTopics = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/topics/bulk/seed', {});
    console.log('✅ Topics seeded successfully!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error seeding topics:', error.response?.data || error.message);
    process.exit(1);
  }
};

seedTopics();
