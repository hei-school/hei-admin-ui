#!/bin/bash
aws codeartifact login --tool npm --repository "$1" --domain "$2" --domain-owner "$3" --region "eu-west-3" --profile hei