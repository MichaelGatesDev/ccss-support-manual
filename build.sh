#!/bin/bash

function perform(){
    echo "=== CLEANUP ==="

    echo "Removing old app directory"
    rm -rf app
    echo "Finished removing old app directory"

    echo ""

    # Create final directory
    mkdir app


    echo "=== BUILDING FRONTEND ==="

    # Go into frontend dir
    cd frontend
    # Run ReactJS build
    yarn run build
    # Move the build folder into the backend to be built into it
    mv -v build/ ../backend/build/
    # Navigte to the project root
    cd ..

    echo "=== FRONTEND COMPLETE ==="

    echo ""

    echo "=== BUILDING BACKEND ==="

    # Go into backend dir
    cd backend
    # Run build (pkg)
    yarn run build
    # Move the build folder up to the project root
    mv application* ../app
    # Remove empty directory
    rm -rf build

    cp -r public ../app/

    # Return to project root
    cd ..

    echo "=== BACKEND COMPLETE ==="

    echo ""

    echo "Finished building application!"
}

time perform