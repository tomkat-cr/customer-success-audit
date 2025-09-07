#!/bin/sh

# Get the API base URL from the environment variable
API_BASE_URL=$1
API_DEBUG=$2

# Check if the API base URL is provided
if [ -z "$API_BASE_URL" ]; then
    echo "Error: API base URL is not provided."
    exit 1
fi

# Replace the API base URL in the index.html file
perl -pi -e "s|const apiBaseUrl = \".*|const apiBaseUrl = \"${API_BASE_URL}\";|g" index.html
perl -pi -e "s|const debug = .*|const debug = ${API_DEBUG};|g" index.html
