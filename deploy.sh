#!/bin/bash
git fetch --all
git reset --hard origin/master
git checkout master
git pull

forever restart server.js
