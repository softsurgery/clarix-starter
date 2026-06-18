# 🟢 Simple Questions

### 1. Show all computers.
**Expected concepts:**
- SELECT
- FROM

**Query:**
```sql
SELECT *
FROM computers;
```

### 2. List all users.
**Expected concepts:**
- SELECT specific columns

**Query:**
```sql
SELECT username
FROM users;
```

### 3. Show all running processes.
**Expected concepts:**
- WHERE clause

**Query:**
```sql
SELECT process_name
FROM processes
WHERE state = 'RUNNING';
```

### 4. Display active services.
**Expected concepts:**
- WHERE clause

**Query:**
```sql
SELECT service_name
FROM services
WHERE status = 'ACTIVE';
```

### 5. Show all alerts with HIGH severity.
**Expected concepts:**
- WHERE clause

**Query:**
```sql
SELECT *
FROM alerts
WHERE severity = 'HIGH';
```

### 6. List storage devices larger than 500 GB.
**Expected concepts:**
- Numeric comparison

**Query:**
```sql
SELECT *
FROM storage_devices
WHERE capacity_gb > 500;
```

### 7. Find all logs with ERROR level.
**Expected concepts:**
- String matching

**Query:**
```sql
SELECT *
FROM logs
WHERE log_level = 'ERROR';
```

### 8. Show all network connections using TCP.
**Expected concepts:**
- WHERE clause

**Query:**
```sql
SELECT *
FROM network_connections
WHERE protocol = 'TCP';
```

# 🟡 Intermediate Questions

### 9. Show each computer and its owner.
**Expected concepts:**
- JOIN

**Query:**
```sql
SELECT c.hostname, u.username
FROM computers c
JOIN users u
ON c.user_id = u.user_id;
```

### 10. Display the operating system installed on every computer.
**Expected concepts:**
- JOIN

**Query:**
```sql
SELECT c.hostname, os.os_name, os.version
FROM computers c
JOIN operating_systems os
ON c.os_id = os.os_id;
```

### 11. Calculate the total RAM installed on each computer.
**Expected concepts:**
- SUM()
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
SUM(m.capacity_gb) AS total_ram
FROM computers c
JOIN memory_modules m
ON c.computer_id = m.computer_id
GROUP BY c.hostname;
```

### 12. Find the process using the most memory.
**Expected concepts:**
- ORDER BY DESC
- LIMIT 1

**Query:**
```sql
SELECT process_name, memory_usage_mb
FROM processes
ORDER BY memory_usage_mb DESC
LIMIT 1;
```

### 13. Count how many processes each computer is running.
**Expected concepts:**
- COUNT()
- LEFT JOIN
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
COUNT(p.process_id) AS number_of_processes
FROM computers c
LEFT JOIN processes p
ON c.computer_id = p.computer_id
GROUP BY c.hostname;
```

### 14. Find the average CPU usage recorded for each computer.
**Expected concepts:**
- AVG()
- JOIN
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
AVG(pm.cpu_percent) AS average_cpu
FROM computers c
JOIN performance_metrics pm
ON c.computer_id = pm.computer_id
GROUP BY c.hostname;
```

### 15. Show all threads belonging to each process.
**Expected concepts:**
- JOIN

**Query:**
```sql
SELECT p.process_name,
t.thread_number,
t.state
FROM processes p
JOIN threads t
ON p.process_id = t.process_id;
```

### 16. Count active services per computer.
**Expected concepts:**
- COUNT()
- WHERE
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
COUNT(s.service_id) AS active_services
FROM computers c
JOIN services s
ON c.computer_id = s.computer_id
WHERE s.status = 'ACTIVE'
GROUP BY c.hostname;
```

### 17. Find computers with more than one memory module.
**Expected concepts:**
- HAVING
- COUNT()
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
COUNT(m.memory_id)
FROM computers c
JOIN memory_modules m
ON c.computer_id = m.computer_id
GROUP BY c.hostname
HAVING COUNT(m.memory_id) > 1;
```

# 🔴 Difficult Questions

### 18. Find the computer with the highest average CPU utilization.
**Expected concepts:**
- AVG()
- ORDER BY DESC
- LIMIT 1
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
AVG(pm.cpu_percent) AS avg_cpu
FROM computers c
JOIN performance_metrics pm
ON c.computer_id = pm.computer_id
GROUP BY c.hostname
ORDER BY avg_cpu DESC
LIMIT 1;
```

### 19. Find users who own a computer having at least one HIGH alert.
**Expected concepts:**
- DISTINCT
- Multiple JOINs
- WHERE

**Query:**
```sql
SELECT DISTINCT u.username
FROM users u
JOIN computers c
ON u.user_id = c.user_id
JOIN alerts a
ON c.computer_id = a.computer_id
WHERE a.severity = 'HIGH';
```

### 20. Find the process that has the largest number of threads.
**Expected concepts:**
- COUNT()
- GROUP BY
- ORDER BY DESC
- LIMIT 1

**Query:**
```sql
SELECT p.process_name,
COUNT(t.thread_id) AS thread_count
FROM processes p
JOIN threads t
ON p.process_id = t.process_id
GROUP BY p.process_name
ORDER BY thread_count DESC
LIMIT 1;
```

### 21. Find computers whose average memory usage exceeds 70%.
**Expected concepts:**
- AVG()
- HAVING
- GROUP BY

**Query:**
```sql
SELECT c.hostname,
AVG(pm.memory_percent) AS avg_memory
FROM computers c
JOIN performance_metrics pm
ON c.computer_id = pm.computer_id
GROUP BY c.hostname
HAVING AVG(pm.memory_percent) > 70;
```

### 22. Show all computers that have no active services.
**Expected concepts:**
- NOT EXISTS
- Subqueries

**Query:**
```sql
SELECT c.hostname
FROM computers c
WHERE NOT EXISTS (
SELECT 1
FROM services s
WHERE s.computer_id = c.computer_id
AND s.status = 'ACTIVE'
);
```

### 23. Find the user whose computers consume the most CPU on average.
**Expected concepts:**
- Multiple JOINs
- AVG()
- GROUP BY
- ORDER BY DESC
- LIMIT 1

**Query:**
```sql
SELECT u.username,
AVG(pm.cpu_percent) AS avg_cpu
FROM users u
JOIN computers c
ON u.user_id = c.user_id
JOIN performance_metrics pm
ON c.computer_id = pm.computer_id
GROUP BY u.username
ORDER BY avg_cpu DESC
LIMIT 1;
```

### 24. Rank processes by CPU usage.
**Expected concepts:**
- Window functions
- RANK() OVER()

**Query:**
```sql
SELECT process_name,
cpu_usage,
RANK() OVER (ORDER BY cpu_usage DESC) AS rank
FROM processes;
```

### 25. Find the computer that has the largest total amount of RAM.
**Expected concepts:**
- SUM()
- GROUP BY
- ORDER BY DESC
- LIMIT 1

**Query:**
```sql
SELECT c.hostname,
SUM(m.capacity_gb) AS total_ram
FROM computers c
JOIN memory_modules m
ON c.computer_id = m.computer_id
GROUP BY c.hostname
ORDER BY total_ram DESC
LIMIT 1;
```
