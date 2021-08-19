interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  port: string | number;
  database: string;
}

export const getPostgresUrl = ({ host, user, password, port, database }: DatabaseConfig) => {
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};
