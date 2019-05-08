
echo "=== CLEANUP ==="


$path = ".\build\"
# If build directory already exists
if((test-path $path))
{
    echo "Removing old app directory"
    Remove-Item -Path $path -Recurse -Force
    echo "Finished removing old app directory"
}

# Build directory does not exist yet, create it
New-Item -ItemType Directory -Force -Path $path
echo "Created build directory"


echo "=== BUILDING FRONTEND ==="

# Go into frontend dir
cd ".\frontend\"
# Run ReactJS build
yarn run build
# Move the build folder into the backend to be built into it
Move-Item -Path ".\build" -Destination "..\backend\build"
# Navigate to the project root
cd ..
echo "=== FRONTEND COMPLETE ==="


echo ""
    

echo "=== BUILDING BACKEND ==="
# Go into backend dir
cd backend
# Run build (pkg)
yarn run build
# Move the build folder up to the build dir
$ApplicationFiles = Get-ChildItem | Where-Object -Property Name -Match 'application-*'
foreach ($File in $ApplicationFiles)
{
    Move-Item -Path $File.PSPath -Destination "..\build\$File"
    echo "Moved $File"
}
# Remove empty directory
Remove-Item -Path ".\build" -Force -Recurse
Copy-Item -Recurse -Path ".\public" -Destination "..\build\"
# Return to project root
cd ..
echo "=== BACKEND COMPLETE ==="


echo ""

echo "Finished building application!"


