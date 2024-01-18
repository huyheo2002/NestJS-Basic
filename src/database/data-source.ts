// import { User } from "src/user/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

// demo
// npm run migration:generate -- src/database/migrations/initial
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "123456",
    database: process.env.POSTGRES_DB || "",
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/database/migrations/*{.ts,.js}"],
    synchronize: true,
    logging: true,
}

const dataSouce = new DataSource(dataSourceOptions);

export default dataSouce;