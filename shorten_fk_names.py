import re

# Read the SQL file
with open('drizzle/0000_slimy_arachne.sql', 'r') as f:
    sql = f.read()

# Function to shorten constraint names
def shorten_constraint(match):
    full_name = match.group(1)
    if len(full_name) <= 64:
        return match.group(0)
    
    # Extract table name and create a shorter version
    parts = full_name.split('_')
    # Take first 3 chars of each part and join
    short_name = '_'.join([p[:3] for p in parts])[:60] + '_fk'
    
    return match.group(0).replace(full_name, short_name)

# Replace long constraint names
sql = re.sub(r'CONSTRAINT `([^`]+)`', shorten_constraint, sql)

# Write back
with open('drizzle/0000_slimy_arachne.sql', 'w') as f:
    f.write(sql)

print("Shortened all constraint names to fit MySQL 64-character limit")
