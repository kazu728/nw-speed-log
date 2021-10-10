import { Schema } from 'mongoose'

export type NwLog = Readonly<{
  _id: string
  container_id: string
  container_name: string
  log: string | null
  source: string
  time: Date
}>

export const NwLogMongoSchema = new Schema<NwLog>({
  _id: String,
  container_id: String,
  container_name: String,
  log: String,
  source: String,
  time: Date,
})

export const bqSchema = {
  fields: [
    { name: 'time', type: 'TIMESTAMP' },
    { name: 'ip', type: 'STRING' },
    { name: 'isp', type: 'STRING' },
    { name: 'country', type: 'STRING' },
    { name: 'download', type: 'FLOAT' },
    { name: 'upload', type: 'FLOAT' },
  ],
}
