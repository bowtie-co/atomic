#!/bin/bash

export REACT_APP_VERSION=${COMMIT:-dev}

npm install
npm run build
