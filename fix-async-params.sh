#!/bin/bash

# Script to fix async params in all dynamic API routes for Next.js 16

# Files to fix
FILES=(
  "src/app/api/spending/[id]/route.ts"
  "src/app/api/services/[id]/route.ts"
)

for file in "${FILES[@]}"; do
 echo "Fixing $file..."
  # Replace the params type and add await
  sed -i '' 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' "$file"
  # Add await params line after function signature - this requires manual fixing
done

echo "Done! Manual step required: Add 'const { id } = await params;' after each function signature"
echo "and replace all 'params.id' with 'id' in the function bodies."
