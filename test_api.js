const axios = require('axios');

async function testRegister() {
    try {
        console.log('Testing Reqres Register with eve.holt@reqres.in / pistol');
        const response = await axios.post('https://reqres.in/api/register', {
            email: 'eve.holt@reqres.in',
            password: 'pistol'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.log('Error Status:', error.response ? error.response.status : 'Unknown');
        console.log('Error Data:', error.response ? error.response.data : error.message);
    }
}

testRegister();
