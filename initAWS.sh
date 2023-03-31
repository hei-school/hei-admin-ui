#!/bin/bash
aws configure set aws_access_key_id "$1" --profile hei
aws configure set aws_secret_access_key "$2" --profile hei
aws configure set default.region "$3" --profile hei