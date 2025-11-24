#!/usr/bin/env python3
"""
Fix all .returning() calls in server/db.ts to be MySQL-compatible.
This script handles all patterns systematically.
"""

import re

def fix_db_file():
    with open('server/db.ts', 'r') as f:
        lines = f.readlines()
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Pattern: const result = await db.insert(TABLE).values(...).returning();
        # Next line: return result[0];
        if '.insert(' in line and '.returning()' in line and 'const result' in line:
            # Extract table name
            match = re.search(r'db\.insert\((\w+)\)', line)
            if match:
                table = match.group(1)
                # Remove .returning()
                lines[i] = line.replace('.returning()', '')
                # Check if next line is return result[0]
                if i + 1 < len(lines) and 'return result[0]' in lines[i + 1]:
                    # Insert new lines after the insert
                    indent = '  '
                    new_lines = [
                        f'{indent}const insertId = Number(result.insertId);\n',
                        f'{indent}const inserted = await db.select().from({table}).where(eq({table}.id, insertId)).limit(1);\n'
                    ]
                    lines[i + 1:i + 1] = new_lines
                    # Update return statement
                    lines[i + 3] = lines[i + 3].replace('result[0]', 'inserted[0]')
                    i += 3
        
        # Pattern: const result = await db.update(TABLE).set(...).where(eq(TABLE.id, ID)).returning();
        # Next line: return result[0];
        elif '.update(' in line and '.returning()' in line and 'const result' in line:
            # Extract table name and id variable
            match = re.search(r'db\.update\((\w+)\).*eq\(\1\.id, (\w+)\)', line)
            if match:
                table = match.group(1)
                id_var = match.group(2)
                # Remove .returning()
                lines[i] = line.replace('.returning()', '')
                # Check if next line is return result[0]
                if i + 1 < len(lines) and 'return result[0]' in lines[i + 1]:
                    # Insert new lines after the update
                    indent = '  '
                    new_lines = [
                        f'{indent}const updated = await db.select().from({table}).where(eq({table}.id, {id_var})).limit(1);\n'
                    ]
                    lines[i + 1:i + 1] = new_lines
                    # Update return statement
                    lines[i + 2] = lines[i + 2].replace('result[0]', 'updated[0]')
                    i += 2
        
        # Pattern: multiline insert/update with .returning() on separate line
        elif '.returning();' in line and 'const result' not in line:
            # Just remove .returning()
            lines[i] = line.replace('.returning()', '')
        
        i += 1
    
    with open('server/db.ts', 'w') as f:
        f.writelines(lines)
    
    print("Fixed all .returning() calls in server/db.ts")

if __name__ == '__main__':
    fix_db_file()
