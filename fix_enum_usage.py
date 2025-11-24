#!/usr/bin/env python3
"""
Fix enum usage in schema files to use MySQL pattern.

PostgreSQL: role: roleEnum("role").default("user")
MySQL: role: roleEnum.default("user")

The enum name is already defined in the mysqlEnum() call, so we don't pass it again.
"""

import re

def fix_enum_usage(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Pattern: enumName("column_name") → enumName
    # Match any word ending in Enum followed by ("...")
    pattern = r'(\w+Enum)\("[^"]+"\)'
    replacement = r'\1'
    
    content = re.sub(pattern, replacement, content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Fixed enum usage in {filepath}")

def main():
    files = [
        'drizzle/schema.ts',
        'drizzle/schema_org_members.ts'
    ]
    
    for filepath in files:
        try:
            fix_enum_usage(filepath)
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

if __name__ == '__main__':
    main()
