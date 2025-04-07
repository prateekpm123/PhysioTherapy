#!/bin/bash

# Build the development version
echo "Building development version..."
npm run build:dev

# Deploy to Google Cloud
echo "Deploying to Google Cloud..."
gcloud app deploy app.yaml --project=your-project-id --version=dev

echo "Deployment complete!" 