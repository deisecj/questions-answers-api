import mysql, { Pool } from 'mysql';

export class DbClient {

    private currentPool: Pool;

    constructor() {
        this.currentPool  = mysql.createPool({
            connectionLimit : 10,
            host            : process.env.DB_HOST,
            user            : process.env.DB_USER,
            password        : process.env.DB_PASSWORD,
            database        : process.env.DB_NAME
        });
    }

    public query(query: string, params?: any): Promise<any[]> {
       return new Promise((resolve, reject) => {
            this.getConnection().query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
       });
    }

    public getConnection(): Pool {
        return this.currentPool;
    }
}

let dbClient: DbClient;

const getClient = () => {
    if (dbClient) {
        return dbClient;
    }

    dbClient = new DbClient();
    return dbClient;
}

export default getClient;
