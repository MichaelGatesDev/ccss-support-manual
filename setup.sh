#!/bin/bash

echo "Setting up..."
cd backend && npm install
cd ..
cd frontend && npm install
cd .. 
echo "Completed setup"