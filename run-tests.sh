#!/bin/bash

echo "🧪 Running Snake Game Tests..."

echo "📦 Backend Tests:"
cd server && npm test
cd ..

echo "🌐 Integration Tests:"
echo "Open server/test-fullstack.html in browser to test API connectivity"

echo "✅ Tests Complete!"