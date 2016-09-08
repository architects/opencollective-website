# Project Scripts

## Start

The Start script is responsible for spinning up a local development server. It will take care of everything 
you need to be up and running and hacking on the project.

## Dependency Scripts

The dependency scripts expose various actions related to managing the project dependencies,
such as creating DLL bundles for use in development. DLL bundles provide often 2-3x speed improvement
in webpack build times by caching third party module data that doesn't change as often as our project code.

## Build Scripts

The build scripts generate deployment assets.
