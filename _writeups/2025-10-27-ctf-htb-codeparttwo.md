---
layout: post
title: "HTB - CodePartTwo"
date: 2025-10-27 10:00:00 +0000
locked: tfalsee
collection: writeups
tags: [htb, writeup, ctf, codeparttwo, linux, rce, remote-code-execution, js2py, cve-2024-28397, web-application, directory-fuzzing, feroxbuster, rustscan, sqlite, users-db, password-cracking, hashid, privilege-escalation, npbackup, root]
image: "/assets/images/thumbnails/htb/ctf/codeparttwo/thumbnail.png"
description: "A full walkthrough of CodePartTwo, covering everything from JS2Py exploitation to database extraction and a clever npbackup privilege escalation technique."
author: "SoftAndoWetto"
---

# Details
```
IP: 10.10.11.82
Difficulty: Easy
Platform: Linux
```

## Scanning Ports

Firsly, I ran a Rustscan on the target to find which ports were open and to enumerate the services and their versions. 

![Rustscan](/assets/images/thumbnails/htb/ctf/codeparttwo/Rustscan.png)

## Services and Versions

After the scan, we see 2 ports open, so we immediately go to visit port 8000, where there is a website hosted


![Rustscan2](/assets/images/thumbnails/htb/ctf/codeparttwo/Rustscan2.png)

## Web Application Access

Visiting the web application we see some information about an app, a download code link, login and register. So of course we make an acount

![webpage](/assets/images/thumbnails/htb/ctf/codeparttwo/webpage.png)

## Account Registration

Making an account...

![register](/assets/images/thumbnails/htb/ctf/codeparttwo/register.png)

## Dashboard Interaction

Then after logging in, we see a dashboard where we can enter javascript code that will be excecuted. Interesting

![dashboard](/assets/images/thumbnails/htb/ctf/codeparttwo/dashboard.png)

## Running JavaScript and Monitoring Requests

After running some code and checking the network tab, we can see that a post request is made to the subdirectory /run_code which is presumably where the api is to send over the code to be executed by the backend

![running_code](/assets/images/thumbnails/htb/ctf/codeparttwo/running_code.png)

## Directory Fuzzing

From here I ran FeroxBuster on the web server,to find subdirs that could be exploited or provided sensitive information. Finding again the download app page

![ferox_scan](/assets/images/thumbnails/htb/ctf/codeparttwo/ferox_scan.png)

## Source Code Review

Then after downloading and reviewing the applications source code, focusing on `app.py`. We could see the library `js2py` to convert submitted JavaScript into Python code for execution. Bingo!

![app_files](/assets/images/thumbnails/htb/ctf/codeparttwo/app_files.png)
![app](/assets/images/thumbnails/htb/ctf/codeparttwo/app.png)

## Identifying Vulnerability CVE-2024-28397

After looking up any related vulnerabilities, I came across **CVE-2024-28397**, and in turn a PoC for it

![CVE-2024-28397](/assets/images/thumbnails/htb/ctf/codeparttwo/CVE-2024-28397.png)

## Proof of Concept Exploit

I tested the PoC exploit against the `/run_code` endpoint, managed to get a reverse shell to the server

![running_exploit](/assets/images/thumbnails/htb/ctf/codeparttwo/running_exploit.png)

## User Enumeration

Using the code execution capability, I enumerated users on the system to identify potential targets for privilege escalation.  

![users](/assets/images/thumbnails/htb/ctf/codeparttwo/users.png)

## Locating and Reading the Database

I located the `users.db` file containing user credentials and inspected its contents. This database included hashed passwords for registered accounts.

![users_database](/assets/images/thumbnails/htb/ctf/codeparttwo/users_database.png)
![account_hashes](/assets/images/thumbnails/htb/ctf/codeparttwo/account_hashes.png)

## Cracking Password Hashes

Using Hashid, I identified the hash algorithm used for the stored passwords. I then cracked the hash of one user account, which allowed me to log in as that user.

![hash_type](/assets/images/thumbnails/htb/ctf/codeparttwo/hash_type.png)
![cracked_hash](/assets/images/thumbnails/htb/ctf/codeparttwo/cracked_hash.png)

## Accessing User Account and First Flag

I logged in as the user `marco` and retrieved the first flag. I also explored files within marco’s home directory for additional information and potential escalation paths.

![first_flag](/assets/images/thumbnails/htb/ctf/codeparttwo/first_flag.png)

## Privilege Escalation Enumeration

I checked `sudo` permissions for marco and reviewed the output of `npbackup --help` to identify potential vectors for privilege escalation.

![sudo_perms](/assets/images/thumbnails/htb/ctf/codeparttwo/sudo_perms.png)
![npbackup_help](/assets/images/thumbnails/htb/ctf/codeparttwo/npbackup_help.png)

## Reviewing Configuration Files

I examined configuration files in the application directories to confirm paths, permissions, and other details relevant to privilege escalation.

![conf](/assets/images/thumbnails/htb/ctf/codeparttwo/conf.png)

## Gaining Root Access

By modifying the program’s working path to `/root`, I used `npbackup` to read sensitive files, including the root flag. This demonstrated a successful privilege escalation.

![root_flag](/assets/images/thumbnails/htb/ctf/codeparttwo/root_flag.png)
