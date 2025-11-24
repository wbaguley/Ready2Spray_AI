import mysql from 'mysql2/promise';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🌱 Seeding database for owner account...');
    
    // Get owner user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [process.env.OWNER_EMAIL || 'wyatt@gtmplanetary.com']
    );
    
    if (users.length === 0) {
      console.error('❌ Owner user not found. Please log in first to create the user.');
      process.exit(1);
    }
    
    const owner = users[0];
    console.log(`✅ Found owner: ${owner.name} (${owner.email})`);
    
    // Check if organization already exists
    const [existingOrgs] = await connection.execute(
      'SELECT * FROM organizations WHERE owner_id = ? LIMIT 1',
      [owner.id]
    );
    
    let orgId;
    
    if (existingOrgs.length > 0) {
      orgId = existingOrgs[0].id;
      console.log(`✅ Organization already exists: ${existingOrgs[0].name} (ID: ${orgId})`);
    } else {
      // Create organization
      const billingStart = new Date();
      const billingEnd = new Date();
      billingEnd.setMonth(billingEnd.getMonth() + 1);
      
      const [orgResult] = await connection.execute(
        `INSERT INTO organizations (
          name, owner_id, email, mode, subscription_plan, subscription_status,
          ai_credits_total, ai_credits_used, ai_credits_rollover,
          billing_period_start, billing_period_end, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          'Ready2Spray Demo',
          owner.id,
          owner.email,
          'ag_aerial',
          'enterprise',
          'active',
          999999,
          0,
          0,
          billingStart,
          billingEnd
        ]
      );
      
      orgId = orgResult.insertId;
      console.log(`✅ Created organization: Ready2Spray Demo (ID: ${orgId})`);
      
      // Add owner as organization member
      await connection.execute(
        `INSERT INTO organization_members (organization_id, user_id, role, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())`,
        [orgId, owner.id, 'owner']
      );
      console.log(`✅ Added owner as organization member`);
    }
    
    // Create sample customers
    console.log('📋 Creating sample customers...');
    const customers = [
      ['Johnson Farm', 'john@johnsonfarm.com', '555-0101', '123 Farm Rd', 'Springfield', 'IL', '62701'],
      ['Smith Orchards', 'mary@smithorchards.com', '555-0102', '456 Orchard Ln', 'Bloomington', 'IL', '61701'],
      ['Davis Ranch', 'bob@davisranch.com', '555-0103', '789 Ranch Dr', 'Peoria', 'IL', '61602'],
    ];
    
    for (const [name, email, phone, address, city, state, zipCode] of customers) {
      await connection.execute(
        `INSERT INTO customers (org_id, name, email, phone, address, city, state, zip_code, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [orgId, name, email, phone, address, city, state, zipCode]
      );
    }
    console.log(`✅ Created ${customers.length} sample customers`);
    
    // Get customer IDs
    const [customerRows] = await connection.execute(
      'SELECT id, name FROM customers WHERE org_id = ? ORDER BY id LIMIT 3',
      [orgId]
    );
    
    // Create job statuses if they don't exist
    console.log('📊 Creating job statuses...');
    const statuses = [
      ['pending', 'Pending', '#FFA500', 1],
      ['scheduled', 'Scheduled', '#0000FF', 2],
      ['in_progress', 'In Progress', '#FFFF00', 3],
      ['completed', 'Completed', '#008000', 4],
      ['cancelled', 'Cancelled', '#FF0000', 5],
    ];
    
    const statusIds = {};
    for (const [value, label, color, order] of statuses) {
      const [result] = await connection.execute(
        `INSERT INTO job_statuses (org_id, value, label, color, \`order\`, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [orgId, value, label, color, order]
      );
      statusIds[value] = result.insertId;
    }
    console.log(`✅ Created ${statuses.length} job statuses`);
    
    // Get status IDs
    const [statusRows] = await connection.execute(
      'SELECT id, value FROM job_statuses WHERE org_id = ? ORDER BY `order` LIMIT 5',
      [orgId]
    );
    const statusMap = {};
    statusRows.forEach(row => {
      statusMap[row.value] = row.id;
    });
    
    // Create sample jobs
    console.log('💼 Creating sample jobs...');
    const jobs = [
      ['Spring Fertilization - Johnson Farm', 'Apply nitrogen fertilizer to corn fields', 'fertilization', 'high', statusMap['scheduled'], customerRows[0]?.id],
      ['Pest Control - Smith Orchards', 'Apply insecticide to apple orchards', 'pest_control', 'medium', statusMap['in_progress'], customerRows[1]?.id],
      ['Herbicide Application - Davis Ranch', 'Pre-emergent herbicide for weed control', 'herbicide', 'low', statusMap['pending'], customerRows[2]?.id],
    ];
    
    for (const [title, description, jobType, priority, statusId, customerId] of jobs) {
      if (customerId && statusId) {
        await connection.execute(
          `INSERT INTO jobs (org_id, customer_id, title, description, job_type, priority, status_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [orgId, customerId, title, description, jobType, priority, statusId]
        );
      }
    }
    console.log(`✅ Created ${jobs.length} sample jobs`);
    
    // Create sample equipment
    console.log('🚁 Creating sample equipment...');
    const equipment = [
      ['Air Tractor AT-802', 'aircraft', 'N12345', 'active', 1250],
      ['Thrush 510G', 'aircraft', 'N67890', 'active', 980],
      ['John Deere Sprayer', 'ground_equipment', 'JD-001', 'maintenance', null],
    ];
    
    for (const [name, type, registration, status, hours] of equipment) {
      await connection.execute(
        `INSERT INTO equipment (org_id, name, type, registration_number, status, total_hours, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [orgId, name, type, registration, status, hours]
      );
    }
    console.log(`✅ Created ${equipment.length} sample equipment`);
    
    // Create sample personnel
    console.log('👥 Creating sample personnel...');
    const personnel = [
      ['Mike Wilson', 'pilot', 'mike@ready2spray.com', '555-0201', 'ATP12345', 15],
      ['Sarah Chen', 'pilot', 'sarah@ready2spray.com', '555-0202', 'CPL67890', 10],
      ['Tom Rodriguez', 'ground_crew', 'tom@ready2spray.com', '555-0203', null, 0],
    ];
    
    for (const [name, role, email, phone, license, commission] of personnel) {
      // Check if user exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      
      let userId;
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        // Create user
        const [userResult] = await connection.execute(
          `INSERT INTO users (open_id, name, email, role, created_at, updated_at, last_signed_in)
          VALUES (?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [`demo_${email}`, name, email, 'user']
        );
        userId = userResult.insertId;
      }
      
      // Add as organization member
      await connection.execute(
        `INSERT INTO organization_members (organization_id, user_id, role, created_at, updated_at)
        VALUES (?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE updated_at = NOW()`,
        [orgId, userId, role === 'pilot' ? 'pilot' : 'member']
      );
    }
    console.log(`✅ Created ${personnel.length} sample personnel`);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log(`\nYou can now log in and access the dashboard with sample data.`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
