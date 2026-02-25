const { execSync } = require('child_process');

module.exports = async () => {
    console.log('Global Setup: Seeding database for CyberTasker Test Suites...');
    try {
        execSync('php tests/seed_test_data.php', { stdio: 'inherit' });
        console.log('Global Setup: Database seeding complete.');
    } catch (error) {
        console.error('Global Setup: Database seeding failed:', error.message);
        throw error;
    }
};
