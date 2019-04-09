#!/bin/bash

echo "Building application..."

# Create final directory
mkdir app

# Go into frontend dir
cd frontend
# Run ReactJS build
npm run build
# Move the build folder into the backend to be built into it
mv -v build/ ../backend/build/
# Navigte to the project root
cd ..

# Go into backend dir
cd backend
# Run build (pkg)
npm run build
# Move the build folder up to the project root
mv application-* ../app
# Remove empty directory
rm -rf build

# Return to project root
cd ..

# Setup app folder
cd app

echo "Make sure to create a 'public' folder which holds an 'images' folder with all of the images." > README.txt

echo "Finished building application!"