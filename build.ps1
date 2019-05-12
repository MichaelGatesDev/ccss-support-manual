$StartLocation = (Get-Location).Path
$FinalBuildPath = "$StartLocation\build"
$BackendPath = "$StartLocation\backend"
$BackendBuildPath = "$BackendPath\build"
$FrontendPath = "$StartLocation\frontend"
$FrontendBuildPath = "$FrontendPath\build"

function Cleanup()
{
    echo "=== CLEANUP STARTED ==="

    # If build directory already exists
    if((test-path $FinalBuildPath))
    {
        echo "Removing old build directory"
        Remove-Item -Path $FinalBuildPath -Recurse -Force
        echo "Finished removing old app directory"
    }

    echo "=== CLEANUP COMPLETE ==="
    echo ""
}


function Setup()
{
    # Build directory does not exist yet, create it
    New-Item -ItemType Directory -Force -Path $FinalBuildPath
    echo "Created build directory"
}


function BuildBackend()
{
    echo "=== BUILDING BACKEND ==="

    # Go into backend dir
    cd $BackendPath

    # Run build (pkg)
    yarn run build

    # Move the build folder up to the build dir
    $ApplicationFiles = Get-ChildItem | Where-Object -Property Name -Match 'application-*'
    foreach ($File in $ApplicationFiles)
    {
        Move-Item -Path $File.PSPath -Destination "$FinalBuildPath\$File"
        echo "Moved $File to $FinalBuildPath"
    }
    # Remove empty directory
    Remove-Item -Path $BackendBuildPath -Force -Recurse
    Copy-Item -Recurse -Path "$BackendPath\public" -Destination "$FinalBuildPath"
    # Return to project root
    cd $StartLocation

    echo "=== BACKEND COMPLETE ==="
    echo ""
}
    

function BuildFrontend()
{
    echo "=== FRONTEND BUILD STARTED ==="

    # Go into frontend dir
    cd $FrontendPath

    # Run ReactJS build
    yarn run build

    # Move the build folder into the backend to be built into it
    Move-Item -Path $FrontendBuildPath -Destination $BackendBuildPath

    # Navigate to the project root
    cd $StartLocation

    echo "=== FRONTEND BUILD COMPLETE ==="
    echo ""
}


function Build()
{
    Cleanup
    Setup
    BuildFrontend
    BuildBackend
    echo "Finished building application!"
}

Build