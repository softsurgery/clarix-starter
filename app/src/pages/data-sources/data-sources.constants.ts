export const DB_TYPE_OPTIONS = [
  { name: 'PostgreSQL', code: 'postgresql' },
  { name: 'MySQL', code: 'mysql' },
  { name: 'MariaDB', code: 'mariadb' },
  { name: 'Oracle', code: 'oracle' },
];

export const DEFAULT_PORTS: Record<string, number> = {
  postgresql: 5432,
  mysql: 3306,
  mariadb: 3306,
  oracle: 1521,
};
