import mongoose from 'mongoose'
import { NwLog, NwLogMongoSchema } from './schema'

export interface LogServerClient {
  findNwLogs: (lastInsertdDate: Date | undefined) => Promise<NwLog[]>
}

export class MongoDBClient implements LogServerClient {
  constructor() {
    this.initialize()
  }
  async initialize(): Promise<void> {
    console.log('Start Connecting db')
    await mongoose.connect('mongodb://localhost/fluentd')
    console.log('Connected')
  }

  async findNwLogs(lastInsertedDate: Date | undefined): Promise<NwLog[]> {
    const nwlog = mongoose.model<NwLog>('nw-log', NwLogMongoSchema)

    const requiredWhereConditon = { log: { $exists: true, $ne: '' } }
    const whereCondition = lastInsertedDate
      ? {
          ...requiredWhereConditon,
          time: {
            $gt: lastInsertedDate,
          },
        }
      : requiredWhereConditon

    return await nwlog.find(whereCondition).exec()
  }
}
