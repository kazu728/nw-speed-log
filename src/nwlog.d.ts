export type SpeedTestResult = SpeedTestResponse & { time: string }

export type SpeedTestResponse = {
  ping: number
  download: number
  upload: number
  data: Data
}

export type Data = {
  speeds: Speeds
  client: Client
  server: Server
}

export type Client = {
  ip: string
  lat: number
  lon: number
  isp: string
  isprating: number
  rating: number
  ispdlavg: number
  ispulavg: number
  country: string
}

export type Server = {
  host: string
  lat: number
  lon: number
  location: string
  country: string
  cc: string
  sponsor: string
  distance: number
  distanceMi: number
  ping: number
  id: string
}

export type Speeds = {
  download: number
  upload: number
  originalDownload: number
  originalUpload: number
}

export type StoredNwlog = {
  time: string
  ip: string
  isp: string
  country: string
  download: number
  upload: number
}
