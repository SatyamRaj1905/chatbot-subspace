import { ClientApp } from "~/components/client-app"

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic'

export default function Page() {
  return <ClientApp />
}
