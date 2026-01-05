const { Redis } = require('@upstash/redis');

// Initialize Redis
const getRedisCient = () => {
    // Credentials provided by user
    const url = 'https://fresh-crawdad-24844.upstash.io';
    const token = 'AWEMAAIncDIyZGVmNmRlYmU2ODY0YzM5OTgwMWQ4MDJjODEyMjgwYXAyMjQ4NDQ';

    return new Redis({
        url: url,
        token: token,
    });
};

module.exports = { getRedisCient };
