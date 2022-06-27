#!/bin/bash

sed "s/NPM_REPOSITORY_TOKEN/$1/g" .npmrc.template > .npmrc
