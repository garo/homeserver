homeserver
==========

A set of node.js code which operates my cottage. Currently incorporates heat pump remote handling and motion sensors for security. 

Internal code structure
-----------------------

 - There's *services*, *repositories*, *models* and *drivers*.
 - The services take care of tasks like waiting for read tokens, or checking every minute if a door should be opened or closed based on a configured time period.
 - Repositories encapsulate all access to underlying database.
 - Drivers encapsulate all access to underlying physical hardware.

