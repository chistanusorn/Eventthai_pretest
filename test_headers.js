const axios = require('axios');

async function testWithHeaders() {
    try {
        console.log('Testing Reqres with Browser Headers...');
        const response = await axios.get('https://reqres.in/api/users?page=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        console.log('SUCCESS: API is reachable with headers!');
        console.log('Status:', response.status);
    } catch (error) {
        console.log('FAILED: Still blocked.');
        console.log('Error Status:', error.response ? error.response.status : 'Unknown');
        if (error.response && error.response.data) {
            // Cloudflare usually sends HTML error pages
            const data = String(error.response.data);
            if (data.includes('Cloudflare') || data.includes('challenge')) {
                console.log('Reason: Cloudflare Challenge');
            } else {
                console.log('Reason: ', data.substring(0, 100));
            }
        } else {
            console.log('Error Message:', error.message);
        }
    }
}

testWithHeaders();
