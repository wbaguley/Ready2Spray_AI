import * as cheerio from 'cheerio';

async function testAgrianWithCookies() {
  console.log('Testing Agrian search with cookie-based country selection...\n');
  
  try {
    // Step 1: Set country preference
    console.log('Step 1: Setting country preference...');
    const countryResponse = await fetch('https://www.agrian.com/labelcenter/results.cfm', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      body: 'country=United+States',
    });
    
    // Extract cookies from response
    const setCookieHeaders = countryResponse.headers.getSetCookie();
    console.log('Set-Cookie headers:', setCookieHeaders);
    
    // Build cookie string for subsequent requests
    const cookies = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ');
    console.log('Cookie string:', cookies);
    
    // Step 2: Perform search with cookies
    console.log('\nStep 2: Performing search with cookies...');
    const searchUrl = 'https://www.agrian.com/labelcenter/results.cfm?search=corn';
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cookie': cookies,
      },
    });
    
    const html = await searchResponse.text();
    console.log('Response status:', searchResponse.status);
    console.log('HTML length:', html.length);
    
    const $ = cheerio.load(html);
    
    // Check for country selection modal
    const hasModal = html.includes('Country Selection');
    console.log('Has country selection modal:', hasModal);
    
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

        if (name && name !== 'Product' && !name.includes('Terms of Use')) {
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
      console.log('\nFirst 5 products:');
      products.slice(0, 5).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   EPA #: ${p.registrationNumber}`);
        console.log(`   Registrant: ${p.registrant}`);
        console.log(`   URL: ${p.url}`);
      });
    } else {
      console.log('\nNo products found. Saving HTML for inspection...');
      const fs = await import('fs');
      fs.writeFileSync('/home/ubuntu/agrian-response.html', html);
      console.log('HTML saved to /home/ubuntu/agrian-response.html');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAgrianWithCookies();
