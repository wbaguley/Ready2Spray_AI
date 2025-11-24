#!/usr/bin/env python3
"""
Fix all .returning() calls in server/db.ts to be MySQL-compatible.

PostgreSQL .returning() is not supported in MySQL with Drizzle ORM.
For INSERT: Remove .returning() and query by insertId
For UPDATE: Remove .returning() and query the updated record
"""

import re

def fix_db_file():
    with open('server/db.ts', 'r') as f:
        content = f.read()
    
    # Pattern 1: INSERT with .returning() that returns result[0]
    # Example: const result = await db.insert(table).values(data).returning(); return result[0];
    pattern1 = r'(const result = await db\.insert\((\w+)\)\.values\([^)]+\))\.returning\(\);(\s+return result\[0\];)'
    
    def replace_insert(match):
        insert_stmt = match.group(1)
        table_name = match.group(2)
        return_stmt = match.group(3)
        
        return f'''{insert_stmt};
  const insertId = Number(result.insertId);
  const inserted = await db.select().from({table_name}).where(eq({table_name}.id, insertId)).limit(1);{return_stmt.replace('result[0]', 'inserted[0]')}'''
    
    content = re.sub(pattern1, replace_insert, content)
    
    # Pattern 2: UPDATE with .returning() that returns result[0]
    # Example: const result = await db.update(table).set(data).where(...).returning(); return result[0];
    pattern2 = r'(const result = await db\.update\((\w+)\)\.set\([^)]+\)\.where\(eq\(\2\.id, (\w+)\)\))\.returning\(\);(\s+return result\[0\];)'
    
    def replace_update(match):
        update_stmt = match.group(1)
        table_name = match.group(2)
        id_var = match.group(3)
        return_stmt = match.group(4)
        
        return f'''{update_stmt};
  const updated = await db.select().from({table_name}).where(eq({table_name}.id, {id_var})).limit(1);{return_stmt.replace('result[0]', 'updated[0]')}'''
    
    content = re.sub(pattern2, replace_update, content)
    
    # Pattern 3: Simple .returning() without assignment (just remove it)
    # Example: }).returning();
    content = re.sub(r'}\)\.returning\(\);', '});', content)
    
    # Pattern 4: Remaining .returning() calls (remove them)
    content = re.sub(r'\.returning\(\)', '', content)
    
    with open('server/db.ts', 'w') as f:
        f.write(content)
    
    print("Fixed all .returning() calls in server/db.ts")

if __name__ == '__main__':
    fix_db_file()
