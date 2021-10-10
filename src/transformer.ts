import { tzDayjs } from './lib/dayjs'
import { NwLog } from './schema'
import { SpeedTestResponse, StoredNwlog } from './nwlog'

export const transformToStoredNwLog = (nwlog: NwLog): StoredNwlog => {
  if (!nwlog.log)
    throw new Error(
      `Log field is empty, please check query. Record:${JSON.stringify(nwlog)}`,
    )

  const speedTestResponse: SpeedTestResponse = JSON.parse(nwlog.log)

  const { ip, isp, country } = speedTestResponse.data.client
  const { download, upload } = speedTestResponse.data.speeds
  const time = tzDayjs.utc(nwlog.time).local().format()

  return { time, ip, isp, country, download, upload }
}

export const transformToBigQueryJsonFormat = (
  speedTestResults: StoredNwlog[],
): string =>
  JSON.stringify(speedTestResults).replaceAll('},', '}\n').slice(1).slice(0, -1)
