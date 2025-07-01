# Simon's HTML front end for MorePurpleMoreBetter's D&D 5e Character Record Sheet

This repository contains both an HTML front end with JavaScript adapter, as well as the back-end document-level JavaScript that is used in [MPMB's Character Record Sheet](https://github.com/morepurplemorebetter/MPMBs-Character-Record-Sheet) (2014 rules).

## How to run

Simply opening `index.html` will cause CORS issues in most browsers.

Fortunately, the front end is simple enough to run a server over regular HTTP.
The easiest way to set up a simple server is to use the built-in python module:
```
python -m http.server 8080
```
You can replace 8080 with whatever port you like. On Windows, see [here](https://www.wikihow.com/Install-Python-on-Windows) to install Python.

You can then open the sheet with the following url on your own device:
- http://localhost:8080

(If you changed the port in the server command, also change it in these urls.)

For other devices on a local network, [find your local ip](https://www.wikihow.com/Find-an-IP-Address), and use
- `http://<local_ip>:8080`

To share over the public internet, make sure to [forward the port](https://www.wikihow.com/Set-Up-Port-Forwarding-on-a-Router) in your router, and find out your public ip address (e.g. at https://www.whatismyip.com).
The url for your friends is then:
- `http://<public_ip_address>:<forwarded_port>`


## Extra content

This front end should work with any extra content written for MPMB's Character Record Sheet. You can find such additional content at the [/r/mpmb subreddit](https://www.reddit.com/r/mpmb/). There is also [the MPMB Discord sever](https://discord.gg/Qjq9Z5Q) for discussion and questions.

For syntax to write your own, consult [additional content syntax](additional%20content%20syntax).

Put the files in the `additional_content`` folder and import them into the sheet using the "Import" button.
Each file is a complete script. You can add multiple files, but take note that they will be processed in the order they are added.
Please see the [How-To Guide - Add More Content](https://www.flapkan.com/how-to/add-more-content) on my website for an explanation how to add these scripts to the PDF.

## Known issues

- No option to host a HTTPS server yet
- the global buttons are ugly and only in the upper left corner of the stats tab


## Legal Information
Simon's HTML front end for MorePurpleMoreBetter's D&D 5e Character Record Sheet automates some of the administrative tasks around playing the game of Dungeon & Dragons 5th edition (C) Wizards of the Coast, Inc.

The `_functions`, `_variables`, `additional content` and `additional content syntax` are under Copyright (C) 2014 Joost Wijnen; Flapkan Productions

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You can find a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

&nbsp;

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.
