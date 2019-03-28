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
mkdir public
mkdir public/images

echo "The application will not work properly without the primary and secondary excel sheets and 'buildings' images" > README.txt

echo "Finished building application!"