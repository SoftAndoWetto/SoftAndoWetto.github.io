---
layout: post
title: "HTB - Conversor"
date: 2025-10-26 10:00:00 +0000
locked: true
collection: writeups
tags: [writeup, ctf, hackthebox, conversor, web, xslt, file-upload, reverse-shell, linux, privilege-escalation]
image: "/assets/images/thumbnails/htb/ctf/conversor/thumbnail.png"
description: "Step-by-step walkthrough of the HTB Conversor machine: exploiting XSLT file upload, cracking password hashes, and escalating privileges via needrestart CVE."
author: "SoftAndoWetto"
---

# Details
```
IP: 10.10.11.92
Difficulty: Easy
Platform: Linux
```

First thing, as always, is to run a port scan to see what we're dealing with here

![Rustscan](/assets/images/thumbnails/htb/ctf/conversor/Rustscan.png)
![Rustscan2](/assets/images/thumbnails/htb/ctf/conversor/Rustscan2.png)

We get an SSH port (which is typical), and an HTTP port on 80 that redirects to "convrsor.htb".

So after adding that to **/etc/hosts**, and visiting the page, we are greeted with:

![conversor.htb](/assets/images/thumbnails/htb/ctf/conversor/conversor.htb.png)

And we can see that (most likely) it will be some type of file upload vulnerability.

For now, I did some research into what a **".xslt"** file is because I had never heard of it.

Basically, it's a template for organizing XML files.

Link: https://www.w3schools.com/xml/xsl_intro.asp

![upload_page](/assets/images/thumbnails/htb/ctf/conversor/upload_page.png)

<br>

So I made this malicious xslt file that will give me a reverse shell on the machine

(I forgot to mention it but the application uses flask meaning i can use python code on the system)

![malicious_xslt](/assets/images/thumbnails/htb/ctf/conversor/malicious_xslt.png)

So we upload that and a blank xml file

![reverse_shell](/assets/images/thumbnails/htb/ctf/conversor/reverse_shell.png)

And boom, we get a reverse shell. From here, of course, we do some enumeration.

![accounts](/assets/images/thumbnails/htb/ctf/conversor/accounts.png)

I checked what accounts are on the system and saw **fismathack**, so that's my current target.

![database_file](/assets/images/thumbnails/htb/ctf/conversor/database_file.png)

And after running `ls -lR` to go over all the files and subfolders in the directory, I find **users.db**. So I download the file and enumerate it offline.

![account_hashes](/assets/images/thumbnails/htb/ctf/conversor/account_hashes.png)

And I find the **users** table with, wouldn't you know it, a user named **fismathack**.

So I crack it with Hashcat offline.

We get a password!

![cracked_hash](/assets/images/thumbnails/htb/ctf/conversor/cracked_hash.png)

Using that password, I `su` into the account and get our first flag.

![first_flag](/assets/images/thumbnails/htb/ctf/conversor/first_flag.png)

Now from here we enumerate the account and see what we can do, and run `sudo -l`.

And find an application called `needrestart`.

![sudo_permissions](/assets/images/thumbnails/htb/ctf/conversor/sudo_permissions.png)

After running the command with the `--help` flag to see what we can do with it, and some online research,

![needrestart_usage](/assets/images/thumbnails/htb/ctf/conversor/needrestart_usage.png)

I looked up what kind of exploits are associated with this software and find a few, which all relate to privilege escalation.

![needrestart_exploits](/assets/images/thumbnails/htb/ctf/conversor/needrestart_exploits.png)

And I came across this GitHub repo for privilege escalation using a Python file and running the application as sudo.

![CVE-2024-48990](/assets/images/thumbnails/htb/ctf/conversor/CVE-2024-48990.png)

So, after copying over the files, creating a listener on port 1337, and running `needrestart` as sudo,

we get root access!

![root_shell](/assets/images/thumbnails/htb/ctf/conversor/root_shell.png)

Then, of course, from here we just read the root flag.

And we're done. That was very straightforward.
