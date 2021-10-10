import dotenv from 'dotenv'
import { BigQueryClient, DwhClient } from './dwh-client'
import { LogServerClient, MongoDBClient } from './log-server-client'
import { StoredNwlog } from './nwlog'
import { NwLog } from './schema'
import { transformToStoredNwLog } from './transformer'

dotenv.config()

const main = async (
  logServerClient: LogServerClient,
  dwhClient: DwhClient,
): Promise<void> => {
  const latestInsetedDate = await dwhClient.findLastInsertedDate()

  const nwlogs: NwLog[] = await logServerClient.findNwLogs(latestInsetedDate)
  const speedTestResults: StoredNwlog[] = nwlogs.map(transformToStoredNwLog)

  await dwhClient.insertDataset(speedTestResults)

  process.exit(0)
}

main(new MongoDBClient(), new BigQueryClient())
