import * as cheerio from 'cheerio';

async function testAgrianSearch() {
  console.log('Testing Agrian search for "corn" in United States...\n');
  
  const url = 'https://www.agrian.com/labelcenter/results.cfm?country=United%20States&search=corn';
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const html = await response.text();
    console.log('\nHTML length:', html.length);
    console.log('First 500 chars of HTML:\n', html.substring(0, 500));
    
    const $ = cheerio.load(html);
    
    // Check for country selection modal
    const hasModal = $('body').text().includes('Country Selection') || html.includes('Country Selection');
    console.log('\nHas country selection modal:', hasModal);
    
    // Try to find product table
    const tables = $('table');
    console.log('Number of tables found:', tables.length);
    
    // Parse products
    const products = [];
    $('table tr').each((i, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length >= 3) {
        const nameCell = cells.eq(0);
        const regCell = cells.eq(1);
        const registrantCell = cells.eq(2);

        const productLink = nameCell.find('a');
        const name = productLink.text().trim() || nameCell.text().trim();
        const href = productLink.attr('href');

        if (name && name !== 'Product') {
          products.push({
            name,
            registrationNumber: regCell.text().trim() || undefined,
            registrant: registrantCell.text().trim() || undefined,
            url: href ? `https://www.agrian.com${href}` : undefined,
          });
        }
      }
    });
    
    console.log('\nProducts found:', products.length);
    if (products.length > 0) {
      console.log('\nFirst 3 products:');
      products.slice(0, 3).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   EPA #: ${p.registrationNumber}`);
        console.log(`   Registrant: ${p.registrant}`);
        console.log(`   URL: ${p.url}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAgrianSearch();
