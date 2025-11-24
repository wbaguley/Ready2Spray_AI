#!/usr/bin/env python3
"""
Fix all .returning() calls in all server TypeScript files to be MySQL-compatible.
"""

import re
import glob

def fix_returning_in_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    i = 0
    changes = 0
    while i < len(lines):
        line = lines[i]
        
        # Pattern: const [var] = await db.insert(TABLE).values(...).returning();
        if '.insert(' in line and '.returning()' in line and 'const [' in line:
            # Extract variable name and table name
            var_match = re.search(r'const \[(\w+)\]', line)
            table_match = re.search(r'db\.insert\((\w+)\)', line)
            if var_match and table_match:
                var_name = var_match.group(1)
                table = table_match.group(1)
                # Remove .returning() and change const [var] to const result
                lines[i] = line.replace('.returning()', '').replace(f'const [{var_name}]', 'const result')
                # Insert new lines after the insert
                indent = '  '
                new_lines = [
                    f'{indent}const insertId = Number(result.insertId);\n',
                    f'{indent}const inserted = await db.select().from({table}).where(eq({table}.id, insertId)).limit(1);\n',
                    f'{indent}const {var_name} = inserted[0];\n'
                ]
                lines[i + 1:i + 1] = new_lines
                changes += 1
                i += 4
                continue
        
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
                    changes += 1
                    i += 3
                    continue
        
        # Pattern: const result = await db.update(TABLE).set(...).where(eq(TABLE.id, ID)).returning();
        # Next line: return result[0];
        if '.update(' in line and '.returning()' in line and 'const result' in line:
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
                    changes += 1
                    i += 2
                    continue
        
        # Pattern: multiline insert/update with .returning() on separate line
        if '.returning();' in line and 'const' not in line:
            # Just remove .returning()
            lines[i] = line.replace('.returning()', '')
            changes += 1
        
        i += 1
    
    with open(filepath, 'w') as f:
        f.writelines(lines)
    
    return changes

def main():
    files = [
        'server/dbOrganizations.ts',
        'server/dbOrganizationsExtended.ts',
        'server/servicePlanScheduler.ts'
    ]
    
    total_changes = 0
    for filepath in files:
        try:
            changes = fix_returning_in_file(filepath)
            total_changes += changes
            print(f"Fixed {changes} .returning() calls in {filepath}")
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
    
    print(f"\nTotal: Fixed {total_changes} .returning() calls across all files")

if __name__ == '__main__':
    main()
