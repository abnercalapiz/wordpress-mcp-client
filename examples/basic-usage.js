// Basic usage example for @abnerjezweb/wordpress-mcp-client
// For npm package usage:
// const { WordPressMCPClient } = require('@abnerjezweb/wordpress-mcp-client');

// For local development:
const { WordPressMCPClient } = require('../dist/index');

async function main() {
  // Initialize client
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
    timeout: 30000 // 30 seconds
  });

  try {
    // 1. Discover available endpoints
    console.log('=== Discovering Endpoints ===');
    const discovery = await client.discovery();
    console.log('Available endpoints:', Object.keys(discovery.data.endpoints));

    // 2. Get business information
    console.log('\n=== Business Information ===');
    const business = await client.business();
    console.log('Business Name:', business.data.name);
    console.log('Description:', business.data.description);
    
    if (business.data.hours) {
      console.log('Business Hours:');
      Object.entries(business.data.hours).forEach(([day, hours]) => {
        console.log(`  ${day}: ${hours.open} - ${hours.close}`);
      });
    }

    // 3. Get contact information
    console.log('\n=== Contact Information ===');
    const contact = await client.contact();
    console.log('Email:', contact.data.email);
    console.log('Phone:', contact.data.phone);
    console.log('Address:', contact.data.address);

    // 4. Search for content
    console.log('\n=== Search Results ===');
    const searchResults = await client.search('wordpress', {
      per_page: 5,
      orderby: 'relevance'
    });
    
    console.log(`Found ${searchResults.data.total} results`);
    searchResults.data.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Type: ${result.type}`);
      console.log(`   Date: ${result.date}`);
    });

    // 5. Get services
    console.log('\n=== Services ===');
    const services = await client.services();
    if (services.data && services.data.length > 0) {
      services.data.forEach(service => {
        console.log(`- ${service.name}: ${service.description}`);
      });
    } else {
      console.log('No services configured');
    }

  } catch (error) {
    console.error('\n=== Error ===');
    console.error('Error Type:', error.constructor.name);
    console.error('Message:', error.message);
    
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

// Run the example
main().catch(console.error);