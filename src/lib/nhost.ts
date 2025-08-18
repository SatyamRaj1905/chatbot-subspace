import { NhostClient } from '@nhost/nextjs'

const config = {
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!,
  region: process.env.NEXT_PUBLIC_NHOST_REGION!,
}

console.log('Nhost config:', config)
console.log('Expected auth URL:', `https://${config.subdomain}.auth.${config.region}.nhost.run`)

export const nhost = new NhostClient(config)
