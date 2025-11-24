#!/usr/bin/env python3
"""
Convert drizzle/schema.ts from PostgreSQL to MySQL syntax.

Conversions:
- Import from drizzle-orm/pg-core → drizzle-orm/mysql-core
- pgEnum → mysqlEnum
- pgTable → mysqlTable
- integer().primaryKey().generatedAlwaysAsIdentity() → int().autoincrement().primaryKey()
- integer() → int()
- numeric() → decimal()
- real() → float()
"""

import re

def convert_schema():
    with open('drizzle/schema.ts', 'r') as f:
        content = f.read()
    
    # 1. Convert imports
    content = content.replace('from "drizzle-orm/pg-core"', 'from "drizzle-orm/mysql-core"')
    
    # 2. Convert enum definitions
    content = re.sub(r'\bpgEnum\b', 'mysqlEnum', content)
    
    # 3. Convert table definitions
    content = re.sub(r'\bpgTable\b', 'mysqlTable', content)
    
    # 4. Convert integer types
    content = re.sub(r'\binteger\(', 'int(', content)
    
    # 5. Convert auto-increment primary keys
    # Pattern: int("id").primaryKey().generatedAlwaysAsIdentity()
    content = re.sub(
        r'int\(([^)]+)\)\.primaryKey\(\)\.generatedAlwaysAsIdentity\(\)',
        r'int(\1).autoincrement().primaryKey()',
        content
    )
    
    # Also handle the reverse order
    content = re.sub(
        r'int\(([^)]+)\)\.generatedAlwaysAsIdentity\(\)\.primaryKey\(\)',
        r'int(\1).autoincrement().primaryKey()',
        content
    )
    
    # 6. Convert numeric to decimal
    content = re.sub(r'\bnumeric\(', 'decimal(', content)
    
    # 7. Convert real to float
    content = re.sub(r'\breal\(', 'float(', content)
    
    # 8. Update imports to include MySQL types
    # Replace the import line with MySQL equivalents
    import_pattern = r'import \{[^}]+\} from "drizzle-orm/mysql-core";'
    import_replacement = 'import { boolean, int, json, decimal, mysqlEnum, mysqlTable, text, timestamp, varchar, date, time, float } from "drizzle-orm/mysql-core";'
    content = re.sub(import_pattern, import_replacement, content)
    
    with open('drizzle/schema.ts', 'w') as f:
        f.write(content)
    
    print("Converted drizzle/schema.ts from PostgreSQL to MySQL syntax")

if __name__ == '__main__':
    convert_schema()
