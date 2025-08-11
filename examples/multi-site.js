// Multi-site management example
const { WordPressMCPMultiSite } = require('@abnerjezweb/wordpress-mcp-client');

async function multiSiteExample() {
  // Initialize with multiple sites
  const multiSite = new WordPressMCPMultiSite({
    // Simple format
    'myblog': 'https://myblog.com',
    
    // Detailed format with tags
    'techblog': {
      name: 'Tech Blog',
      url: 'https://techblog.com',
      tags: ['blog', 'technology']
    },
    'company': {
      name: 'Company Website',
      url: 'https://company.com',
      tags: ['corporate', 'services']
    },
    'shop': {
      name: 'Online Shop',
      url: 'https://shop.com',
      tags: ['ecommerce', 'products']
    }
  });

  // 1. List all sites
  console.log('=== All Sites ===');
  const sites = multiSite.listSites();
  sites.forEach(site => {
    console.log(`${site.id}: ${site.name} (${site.url})`);
    if (site.tags) {
      console.log(`  Tags: ${site.tags.join(', ')}`);
    }
  });

  // 2. Add a new site dynamically
  console.log('\n=== Adding New Site ===');
  multiSite.addSite('newsite', {
    name: 'New Client Site',
    url: 'https://newclient.com',
    tags: ['client', 'new']
  });
  console.log('Added new site: newclient.com');

  // 3. Search across all sites
  console.log('\n=== Searching All Sites ===');
  const searchResults = await multiSite.searchAll('wordpress', {
    per_page: 3,
    concurrency: 2 // Process 2 sites at a time
  });

  searchResults.forEach(result => {
    console.log(`\n${result.name} (${result.site}):`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    } else {
      console.log(`  Found ${result.results.data.total} results`);
      result.results.data.results.forEach(item => {
        console.log(`  - ${item.title}`);
      });
    }
  });

  // 4. Search by tag
  console.log('\n=== Searching Blog Sites Only ===');
  const blogResults = await multiSite.searchByTag('blog', 'tips');
  console.log(`Found results in ${blogResults.length} blog sites`);

  // 5. Health check
  console.log('\n=== Health Check ===');
  const health = await multiSite.healthCheck();
  
  const healthy = health.filter(h => h.status === 'healthy').length;
  const errors = health.filter(h => h.status === 'error').length;
  const timeouts = health.filter(h => h.status === 'timeout').length;
  
  console.log(`Healthy: ${healthy}, Errors: ${errors}, Timeouts: ${timeouts}`);
  
  health.forEach(site => {
    if (site.status !== 'healthy') {
      console.log(`${site.site}: ${site.status} - ${site.message || 'Unknown error'}`);
    }
  });

  // 6. Custom operation on all sites
  console.log('\n=== Getting Business Info from All Sites ===');
  const businessInfo = await multiSite.executeOnAll(async (client, siteId) => {
    const business = await client.business();
    return business.data.name;
  });

  businessInfo.forEach(info => {
    if (info.result) {
      console.log(`${info.site}: ${info.result}`);
    }
  });

  // 7. Work with specific site
  console.log('\n=== Working with Specific Site ===');
  const techBlogClient = multiSite.getSite('techblog');
  if (techBlogClient) {
    const contact = await techBlogClient.contact();
    console.log('Tech Blog Contact:', contact.data.email);
  }

  // 8. Remove a site
  console.log('\n=== Removing Site ===');
  const removed = multiSite.removeSite('newsite');
  console.log(`Site removed: ${removed}`);
}

// Bulk import example
async function bulkImportExample() {
  // Import from array of sites
  const sitesToImport = [
    { id: 'site1', name: 'Site 1', url: 'https://site1.com', tags: ['blog'] },
    { id: 'site2', name: 'Site 2', url: 'https://site2.com', tags: ['shop'] },
    { id: 'site3', name: 'Site 3', url: 'https://site3.com', tags: ['blog'] },
    // ... can have 100+ sites
  ];

  const sites = {};
  sitesToImport.forEach(site => {
    sites[site.id] = {
      name: site.name,
      url: site.url,
      tags: site.tags
    };
  });

  const multiSite = new WordPressMCPMultiSite(sites);
  console.log(`Imported ${sitesToImport.length} sites`);
  
  // Search all blog sites
  const blogSites = multiSite.getSitesByTag('blog');
  console.log(`Found ${blogSites.length} blog sites`);
}

// Run examples
console.log('Running Multi-Site Examples...\n');

multiSiteExample()
  .then(() => console.log('\n✅ Multi-site example completed'))
  .catch(error => console.error('\n❌ Error:', error));

// Uncomment to run bulk import example
// bulkImportExample();