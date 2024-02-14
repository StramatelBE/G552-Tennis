#!/bin/bash

echo "Starting setup process..."

GITHUB_REPOSITORY=https://github.com/StramatelBE/G552.git
WORKDIR=server

# Initialize progress
TOTAL_STEPS=7
CURRENT_STEP=0

function print_progress {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    PERCENT=$(( (CURRENT_STEP * 100) / TOTAL_STEPS ))
    echo -ne "Progress: ["
    for ((i = 0; i < (PERCENT / 10); i++)); do echo -n "#"; done
    for ((i = (PERCENT / 10); i < 10; i++)); do echo -n "-"; done
    echo -ne "] $PERCENT% - $1\r"
    sleep 1 # Simulating time taken for the step
}

#SOFTWARE UPDATE
echo -ne "                                    "
print_progress "Updating software packages..."
sudo apt update >/dev/null 2>&1
sudo apt upgrade -y >/dev/null 2>&1

#BASIC UTILITIES
echo -ne "                                    "
print_progress "Installing basic utilities..."
sudo apt install -y vim curl wget git >/dev/null 2>&1

#CLONE REPOSITORY
echo -ne "                                    "
print_progress "Cloning repository..."
cd ~
git clone $GITHUB_REPOSITORY $WORKDIR >/dev/null 2>&1

#NODE INSTALL
echo -ne "                                    "
print_progress "Installing Node.js..."
bash ~/$WORKDIR/scripts/setup/node_install.sh >/dev/null 2>&1
npm install -g serve >/dev/null 2>&1

#NODE MODULE INSTALL
echo -ne "                                    "
print_progress "Installing Node modules..."
bash ~/$WORKDIR/scripts/setup/npm_init.sh >/dev/null 2>&1

#BUILD
echo -ne "                                    "
print_progress "Building project..."
bash ~/$WORKDIR/scripts/build/project_build.sh >/dev/null 2>&1

#RUN
# echo -ne "                                    "
# Commented out since it might not return control back to the script
# print_progress "Running application..."
# bash ~/$WORKDIR/scripts/run/run.sh >/dev/null 2>&1

#SERVICE
# echo -ne "                                    "
# Uncomment and modify as needed
# print_progress "Initializing services..."
# bash ~/$WORKDIR/scripts/services/services_init.sh >/dev/null 2>&1

echo -ne '\n'
echo "### PROJECT FULLY INITIALISED ###"
