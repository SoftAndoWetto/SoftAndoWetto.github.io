---
layout: post
title: "Inside My First-Round Red Team Interview: Networking, Web Exploits, and Windows Attacks"
date: 2025-12-05 10:00:00 +0000
collection: blog
tags: []
image: ""
description: "A behind-the-scenes look at my Red Team interview. This was a first-round technical and experience-based interview, covering networking, operating systems, programming, web vulnerabilities, and Windows authentication attacks."
author: "SoftAndoWetto"
---

# Context & Participants
This interview was with **the department lead responsible for physical security and red team operations.**

The session started with a brief introduction of ourselves and moved into technical questions, followed by discussion of the role, structure, and expectations for new hires.

<br>

# Company & Role Overview
The organisation offers three main services:  

1. **Red Team:** Unlimited penetration testing on a subscription model.  
2. **Blue Team:** Incident response and SOC services.  
3. **Black Team:** Managed IT services, including IoT infrastructure and client support.  

The role I was interviewing for is within the **Red Team**, focusing on offensive security, penetration testing, and client engagements.  

Exposure includes web applications, networks, and physical security assessments.

<br>

# Candidate Background & Experience
- Freelance penetration testing while studying at the University of Bedfordshire.  
- Practical experience writing reports and testing both web applications and networks.  
- Part-time work during studies.  
- Familiarity with tools, labs, and hands-on learning environments.

<br>

# Interview Questions & Play-by-Play

## **Networking**
- **TCP vs UDP:** Explained TCP as connection-oriented and reliable; UDP as faster and connectionless.  
- **TCP Handshake & Termination:** Discussed SYN, SYN/ACK, ACK; touched on FIN for teardown.  
- **ARP & ARP Spoofing:** Explained how ARP resolves IP addresses to MACs; ARP spoofing manipulates cache to redirect traffic.  
- **VLAN:** Described a virtual LAN as a method to isolate traffic on the same physical network.  
- **Switch vs Router:** Differentiated switch (Layer 2) from router (Layer 3).  
- **Subnetting:** Explained network vs host bits, masks, and calculation of subnets.


## **Operating Systems**
- **Purpose of OS:** Manages hardware and resources, provides interface for applications.  
- **Kernel vs User Space:** Kernel manages resources, user space is where applications run.  
- **Running a Program:** Discussed loading an executable into memory and process creation.  
- **System Calls & Context Switching:** Touched on process interaction with kernel and CPU switching between processes.  
- **Process vs Thread:** Compared independent processes vs lightweight threads sharing memory.  
- **Memory Calculation:** Calculated bytes in a million 32-bit integers (~4 MB).


## **Programming Concepts**
- **Iteration vs Recursion:** Iteration as loops, recursion as self-calling functions.  
- **Stack vs Heap:** Stack holds local variables (fast, LIFO), heap is dynamically allocated memory (slower, fragmented).  
- **eval() in Python:** Explained it executes code from a string input.


## **Web Vulnerabilities**
- **SQL Injection:** Discussed in-band, out-of-band, and blind SQLi types.  
- **Cross-Site Scripting (XSS):** Identified multiple types; DOM-Based XSS mentioned briefly.


## **Windows / Active Directory**
- **Kerberos Authentication:** Explained basic mechanism.  
- **AS-REP Roasting:** Covered password hash extraction from Kerberos responses.  
- **SMB / File Shares:** Identified TCP port 445 and attacks possible if SMB signing is not enforced.

<br>

# Role & Company Discussion
The interviewer described high performer traits:  
- Ability to work under pressure  
- Adaptability to different testing types  
- Willingness to learn and contribute to the team  

The organisation is growing rapidly, offering exposure to all aspects of offensive security.  

Structure for career progression is being developed, including junior → senior → team lead → head roles.  

Overtime is available at £50/hour for tests that extend beyond normal working hours.

<br>

# Closing
The interview concluded with confirmation that I would advance to the final round, which will cover deeper operating systems fundamentals, programming concepts, and additional offensive security topics.
