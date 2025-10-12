---
layout: post
title: "Database Enumeration"
categories: [resources]
tags: []
author: "SoftAndoWetto"
---

# MySQL / MariaDB

Connect to the database  
```bash
mysql -h IP -P 3306 -u [USERNAME] -p[PASSWORD]
```

Get Server Versions  
```sql
SELECT @@version, @@version_compile_machine;
```

Show databases  
```sql
SHOW DATABASES;
```

Use Database  
```sql
USE [DBNAME];
```

List Tables  
```sql
SHOW TABLES;
```

List data in the table  
```sql
SELECT * FROM [TABLE];
```

<br><br><br>

# SQLite

Open the database file  
```bash
sqlite3 [DATABASE.db]
```

List Tables  
```bash
.tables
```

List schemas for all tables  
```bash
.schema
```

List the database schema for a table  
```bash
.schema TABLE_NAME
```

List data in the table  
```sql
SELECT * FROM [TABLE];
```

<br><br><br>

# MongoDB

Get versions  
```js
db.version()
db.runCommand({ buildInfo: 1 })
```

List databases  
```js
show dbs
```

or  
```js
db.adminCommand({ listDatabases: 1 })
```

Select a database  
```js
use [DATABASE]
```

List collections  
```js
show collections
```

or  
```js
db.getCollectionNames()
db.getCollectionInfos()
```

List users in current DB (requires privileges)  
```js
db.getUsers()
```
