Create a modern interactive dashboard for a Computer Resource Monitoring and Process Management System. Use a dark theme with cards, filters, and tooltips. Generate the following 8 charts with realistic sample data:

1. CPU Utilization Over Time (Line Chart)
   X-axis: Time (hour/day)
   Y-axis: CPU Usage (%)
   Show trends for multiple computers
   Include average CPU line
2. Memory Consumption by Computer (Bar Chart)
   X-axis: Hostname
   Y-axis: Memory Usage (GB)
   Compare total RAM and used RAM
   Use grouped bars
3. Storage Distribution (Pie Chart)
   Categories:
   SSD
   HDD
   NVMe
   Display percentage of total storage capacity
4. Top 10 Processes by CPU Usage (Horizontal Bar Chart)
   X-axis: CPU Usage (%)
   Y-axis: Process Name
   Sort descending
   Highlight the most resource-intensive process
5. Number of Active Services per Computer (Column Chart)
   X-axis: Computer Hostname
   Y-axis: Number of Active Services
   Show only services with status = 'ACTIVE'
6. Network Connections by Protocol (Donut Chart)
   Categories:
   TCP
   UDP
   ICMP
   Display percentage share of each protocol
7. Thread Count per Process (Horizontal Bar Chart)
   X-axis: Number of Threads
   Y-axis: Process Name
   Show top processes with the highest thread counts
8. System Alerts by Severity (Stacked Bar Chart)
   Categories:
   LOW
   MEDIUM
   HIGH
   CRITICAL
   X-axis: Computer Hostname
   Y-axis: Number of Alerts
   Use different colors for each severity level
   Additional Requirements
   Include KPI cards at the top:
   Total Computers
   Total Processes
   Average CPU Usage
   Average Memory Usage
   Total Active Services
   Add filters for:
   Computer hostname
   User
   Operating system
   Date range
   Display values on hover.
   Use responsive layout.
   Include legends and labels.
   Use PostgreSQL as the data source.
   Make the dashboard suitable for Grafana, Apache Superset, Metabase, Power BI, or Tableau.
   Use realistic sample data for 3 computers, 15 processes, and several performance records.
