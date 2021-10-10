import { BigQuery, QueryRowsResponse } from '@google-cloud/bigquery'
import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import util from 'util'
import { StoredNwlog } from './nwlog'
import { bqSchema } from './schema'
import { transformToBigQueryJsonFormat } from './transformer'

export interface DwhClient {
  findLastInsertedDate: () => Promise<Date | undefined>
  insertDataset: (speedTestResults: StoredNwlog[]) => Promise<void>
}

const gcpCredentials = {
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEY_FILE_PATH,
}

export class BigQueryClient implements DwhClient {
  private bqClient = new BigQuery(gcpCredentials)
  private gcsClient = new Storage(gcpCredentials)

  async findLastInsertedDate(): Promise<Date | undefined> {
    const query = 'SELECT time from nw_logs.nw_logs ORDER BY time DESC LIMIT 1'

    const queryRowsResponse: QueryRowsResponse = await this.bqClient.query(
      query,
      { maxResults: 1 },
    )

    if (!queryRowsResponse[0].length) return

    return new Date(queryRowsResponse[0][0].time.value)
  }

  async insertDataset(speedTestResults: StoredNwlog[]): Promise<void> {
    await this.uploadToGCS(speedTestResults)
    await this.loadFromGCS()
    return
  }

  private async uploadToGCS(speedTestResults: StoredNwlog[]): Promise<void> {
    const outputPath = `${__dirname}/output.json`

    await util.promisify(fs.writeFile)(
      outputPath,
      transformToBigQueryJsonFormat(speedTestResults),
    )
    console.log('Start uploading')

    await this.gcsClient.bucket(process.env.BUCKET_NAME!).upload(outputPath, {
      destination: 'output.json',
    })
    console.log('Upload complted')

    await util.promisify(fs.rm)(outputPath)
  }

  private async loadFromGCS(): Promise<void> {
    const metadata = {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      schema: bqSchema,
      location: 'US',
    }

    console.log('Start loading')

    const [job] = await this.bqClient
      .dataset('nw_logs')
      .table('nw_logs')
      .load(
        this.gcsClient.bucket(process.env.BUCKET_NAME!).file('output.json'),
        metadata,
      )
      .catch((error) => {
        throw new Error(error)
      })

    console.log(`Load completed, job status: ${JSON.stringify(job.status)}`)
  }
}
