# Compilers

The compiler modules contain different webpack build configurations for the different types of
builds we generate from our project.  They are generated using the `@terse/webpack` library which
makes managing webpack's configuration much more manageable given that we are required to maintain
two sets of webpack configuration, one per target (e.g node, web), in order to support universal rendering

Each of these compilers will correspond to a different entry point to the application,
e.g. the frontend react application or the server express application.
