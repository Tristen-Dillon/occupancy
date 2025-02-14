import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Mail, Home, Building2, Info } from 'lucide-react'
import type { ValidatedAddress } from '@/lib/types'
import JSONPretty from 'react-json-pretty'

interface AddressDetailsProps {
  address: ValidatedAddress
}

export function AddressDetails({ address }: AddressDetailsProps) {
  const { validated } = address

  return (
    <div className="flex flex-col gap-4 overflow-y overflow-x-hidden">
      <Card className="w-full">
        <CardHeader className="w-full">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {address.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 w-full">
          <div>
            <h3 className="font-semibold mb-2">Full Address</h3>
            <p>{address.full_address}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Components</h3>
            <div className="grid gap-2">
              {validated.result.address.addressComponents.map(
                (component, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{component.componentType}</Badge>
                    <span>{component.componentName.text}</span>
                  </div>
                )
              )}
            </div>
          </div>
          {validated.result.metadata && (
            <div>
              <h3 className="font-semibold mb-2">Metadata</h3>
              <div className="flex flex-wrap gap-2">
                {validated.result.metadata.business && (
                  <Badge variant="secondary">
                    <Building2 className="h-4 w-4 mr-1" />
                    Business
                  </Badge>
                )}
                {validated.result.metadata.residential && (
                  <Badge variant="secondary">
                    <Home className="h-4 w-4 mr-1" />
                    Residential
                  </Badge>
                )}
                {validated.result.metadata.poBox && (
                  <Badge variant="secondary">
                    <Mail className="h-4 w-4 mr-1" />
                    PO Box
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Validation</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    validated.result.verdict.addressComplete
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {validated.result.verdict.addressComplete
                    ? 'Complete'
                    : 'Incomplete'}
                </Badge>
                <span>Address Completeness</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    validated.result.verdict.hasUnconfirmedComponents
                      ? 'secondary'
                      : 'default'
                  }
                >
                  {validated.result.verdict.hasUnconfirmedComponents
                    ? 'Unconfirmed'
                    : 'Confirmed'}
                </Badge>
                <span>Components Confirmation</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">USPS Data</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>{validated.result.uspsData.dpvFootnote}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {validated.result.uspsData.carrierRoute}
                </Badge>
                <span>Carrier Route</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full">
        <h3 className="font-semibold mb-2">Raw Validated Data</h3>
        <JSONPretty id="json-pretty" data={address}></JSONPretty>
      </div>
    </div>
  )
}
