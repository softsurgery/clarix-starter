CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE operating_systems (
    os_id SERIAL PRIMARY KEY,
    os_name VARCHAR(50) NOT NULL,
    version VARCHAR(20)
);

CREATE TABLE computers (
    computer_id SERIAL PRIMARY KEY,
    hostname VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    os_id INTEGER REFERENCES operating_systems(os_id),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cpus (
    cpu_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    model VARCHAR(100),
    cores INTEGER,
    threads INTEGER,
    frequency_ghz NUMERIC(4,2)
);

CREATE TABLE memory_modules (
    memory_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    capacity_gb INTEGER,
    type VARCHAR(20),
    speed_mhz INTEGER
);

CREATE TABLE storage_devices (
    storage_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    device_name VARCHAR(50),
    type VARCHAR(20),
    capacity_gb INTEGER
);

CREATE TABLE processes (
    process_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    process_name VARCHAR(100),
    pid INTEGER UNIQUE,
    state VARCHAR(20),
    cpu_usage NUMERIC(5,2),
    memory_usage_mb INTEGER,
    started_at TIMESTAMP
);

CREATE TABLE threads (
    thread_id SERIAL PRIMARY KEY,
    process_id INTEGER REFERENCES processes(process_id),
    thread_number INTEGER,
    state VARCHAR(20)
);

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    service_name VARCHAR(100),
    status VARCHAR(20)
);

CREATE TABLE network_interfaces (
    interface_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    interface_name VARCHAR(50),
    mac_address VARCHAR(17),
    speed_mbps INTEGER
);

CREATE TABLE network_connections (
    connection_id SERIAL PRIMARY KEY,
    interface_id INTEGER REFERENCES network_interfaces(interface_id),
    remote_ip VARCHAR(45),
    protocol VARCHAR(10),
    port INTEGER,
    status VARCHAR(20)
);

CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    log_level VARCHAR(10),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE performance_metrics (
    metric_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    cpu_percent NUMERIC(5,2),
    memory_percent NUMERIC(5,2),
    disk_percent NUMERIC(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheduled_tasks (
    task_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    task_name VARCHAR(100),
    next_run TIMESTAMP,
    status VARCHAR(20)
);

CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,
    computer_id INTEGER REFERENCES computers(computer_id),
    severity VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS
INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

-- OPERATING SYSTEMS
INSERT INTO operating_systems (os_name, version) VALUES
('Ubuntu', '24.04'),
('Windows', '11'),
('Debian', '12');

-- COMPUTERS
INSERT INTO computers (hostname, user_id, os_id, ip_address) VALUES
('pc-alice', 1, 1, '192.168.1.10'),
('pc-bob', 2, 2, '192.168.1.11'),
('server-charlie', 3, 3, '192.168.1.20');

-- CPUS
INSERT INTO cpus (computer_id, model, cores, threads, frequency_ghz) VALUES
(1, 'Intel Core i7-12700K', 12, 20, 3.60),
(2, 'AMD Ryzen 7 5800X', 8, 16, 3.80),
(3, 'Intel Xeon E5-2690', 14, 28, 2.90);

-- MEMORY MODULES
INSERT INTO memory_modules (computer_id, capacity_gb, type, speed_mhz) VALUES
(1, 16, 'DDR5', 5200),
(1, 16, 'DDR5', 5200),
(2, 8, 'DDR4', 3200),
(2, 8, 'DDR4', 3200),
(3, 32, 'DDR4', 2666);

-- STORAGE DEVICES
INSERT INTO storage_devices (computer_id, device_name, type, capacity_gb) VALUES
(1, 'Samsung 990 Pro', 'SSD', 1000),
(2, 'WD Blue', 'SSD', 500),
(3, 'Seagate IronWolf', 'HDD', 4000);

-- PROCESSES
INSERT INTO processes
(computer_id, process_name, pid, state, cpu_usage, memory_usage_mb, started_at)
VALUES
(1, 'chrome', 2001, 'RUNNING', 12.5, 850, NOW()),
(1, 'postgres', 2002, 'RUNNING', 4.2, 250, NOW()),
(2, 'discord', 3001, 'SLEEPING', 2.5, 400, NOW()),
(3, 'nginx', 4001, 'RUNNING', 6.8, 150, NOW()),
(3, 'mysql', 4002, 'RUNNING', 9.4, 600, NOW());

-- THREADS
INSERT INTO threads (process_id, thread_number, state) VALUES
(1, 1, 'RUNNING'),
(1, 2, 'RUNNING'),
(2, 1, 'RUNNING'),
(3, 1, 'WAITING'),
(4, 1, 'RUNNING'),
(5, 1, 'RUNNING');

-- SERVICES
INSERT INTO services (computer_id, service_name, status) VALUES
(1, 'Docker', 'ACTIVE'),
(1, 'SSH', 'ACTIVE'),
(2, 'Windows Update', 'ACTIVE'),
(3, 'Apache', 'STOPPED'),
(3, 'FTP', 'ACTIVE');

-- NETWORK INTERFACES
INSERT INTO network_interfaces
(computer_id, interface_name, mac_address, speed_mbps)
VALUES
(1, 'eth0', '00:1A:2B:3C:4D:01', 1000),
(2, 'eth0', '00:1A:2B:3C:4D:02', 1000),
(3, 'eth0', '00:1A:2B:3C:4D:03', 1000);

-- NETWORK CONNECTIONS
INSERT INTO network_connections
(interface_id, remote_ip, protocol, port, status)
VALUES
(1, '8.8.8.8', 'TCP', 443, 'ESTABLISHED'),
(1, '1.1.1.1', 'UDP', 53, 'ACTIVE'),
(2, '142.250.74.14', 'TCP', 80, 'ESTABLISHED'),
(3, '192.168.1.10', 'TCP', 22, 'ESTABLISHED');

-- LOGS
INSERT INTO logs (computer_id, log_level, message) VALUES
(1, 'INFO', 'System boot completed'),
(1, 'WARNING', 'High memory usage detected'),
(2, 'ERROR', 'Driver installation failed'),
(3, 'INFO', 'Backup completed successfully');

-- PERFORMANCE METRICS
INSERT INTO performance_metrics
(computer_id, cpu_percent, memory_percent, disk_percent)
VALUES
(1, 35.2, 60.5, 40.1),
(1, 42.7, 62.0, 41.8),
(2, 20.4, 45.0, 30.0),
(3, 65.5, 78.3, 55.4);

-- SCHEDULED TASKS
INSERT INTO scheduled_tasks
(computer_id, task_name, next_run, status)
VALUES
(1, 'Daily Backup', NOW() + INTERVAL '1 day', 'PENDING'),
(2, 'Disk Cleanup', NOW() + INTERVAL '6 hours', 'PENDING'),
(3, 'Security Scan', NOW() + INTERVAL '12 hours', 'PENDING');

-- ALERTS
INSERT INTO alerts
(computer_id, severity, description)
VALUES
(1, 'MEDIUM', 'Memory usage exceeded 80%'),
(3, 'HIGH', 'Disk space below 10%');