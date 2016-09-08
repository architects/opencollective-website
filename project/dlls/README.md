# Project DLLs

This folder contains configuration files which define named dependency bundles, or what Webpack refers to as DLLs.

> The term `DLL` refers to the output of Webpack's DLL Plugin, which is intended to be used to speed up Webpack builds by creating cached files of the Webpack compiler state after loading all of the modules a project depends on. Generally this will include a JSON manifest, and a distributable javascript file.

## Specs

A Valid DLL configuration file can be required, and will export either:

- A Single array consisting of module dependency names, e.g. `['react','react-router','react-dom']`

- An object with an `entry` property consisting of a single array of module dependency names

- An object with an `entry` property consisting of an object, whose keys are valid DLL names, and whose values are an array of module dependency names
