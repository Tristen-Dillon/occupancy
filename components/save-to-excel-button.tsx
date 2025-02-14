'use client'

import { useAddress } from '@/providers/address-provider'
import { Button } from './ui/button'
import { saveValidatedAddressesToExcel } from '@/lib/save-to-excel'
export default function SaveToExcelButton({
  options = {
    useGoogleGeocode: false,
    buttonText: 'Save to Excel',
  },
}: {
  options: {
    useGoogleGeocode: boolean
    buttonText: string
  }
}) {
  const { addresses } = useAddress()
  const data = addresses.map((address) => ({
    Name: address.name,
    'Full Address': address.full_address,
    Latitude: options.useGoogleGeocode
      ? address.validated.result.geocode.location.latitude
      : address.latitude ??
        address.validated.result.geocode.location.latitude ??
        'N/A',
    Longitude: options.useGoogleGeocode
      ? address.validated.result.geocode.location.longitude
      : address.longitude ??
        address.validated.result.geocode.location.longitude ??
        'N/A',
    'Occupancy PK': address.pk_occupancy,
    'Occupancy ID': address.occup_id,

    // Verdict
    'Input Granularity': address.validated.result.verdict.inputGranularity,
    'Validation Granularity':
      address.validated.result.verdict.validationGranularity,
    'Geocode Granularity': address.validated.result.verdict.geocodeGranularity,
    'Address Complete': address.validated.result.verdict.addressComplete
      ? 'Yes'
      : 'No',
    'Has Unconfirmed Components': address.validated.result.verdict
      .hasUnconfirmedComponents
      ? 'Yes'
      : 'No',
    'Has Inferred Components': address.validated.result.verdict
      .hasInferredComponents
      ? 'Yes'
      : 'No',

    // Postal Address
    'Region Code': address.validated.result.address.postalAddress.regionCode,
    'Postal Code': address.validated.result.address.postalAddress.postalCode,
    'Administrative Area':
      address.validated.result.address.postalAddress.administrativeArea,
    Locality: address.validated.result.address.postalAddress.locality,
    'Address Lines':
      address.validated.result.address.postalAddress.addressLines.join(', '),

    // Geocode
    'Place ID': address.validated.result.geocode.placeId,
    'Global Plus Code': address.validated.result.geocode.plusCode.globalCode,
    'Geocode Bounds Low (Lat)':
      address.validated.result.geocode.bounds.low.latitude,
    'Geocode Bounds Low (Lng)':
      address.validated.result.geocode.bounds.low.longitude,
    'Geocode Bounds High (Lat)':
      address.validated.result.geocode.bounds.high.latitude,
    'Geocode Bounds High (Lng)':
      address.validated.result.geocode.bounds.high.longitude,

    // Metadata
    'Is Business': address.validated.result.metadata?.business ? 'Yes' : 'No',
    'Is PO Box': address.validated.result.metadata?.poBox ? 'Yes' : 'No',
    'Is Residential': address.validated.result.metadata?.residential
      ? 'Yes'
      : 'No',

    // USPS Data
    'USPS First Address Line':
      address.validated.result.uspsData.standardizedAddress.firstAddressLine,
    'USPS DPV Footnote': address.validated.result.uspsData.dpvFootnote,
    'USPS Carrier Route': address.validated.result.uspsData.carrierRoute,
    'USPS Cass Processed': address.validated.result.uspsData.cassProcessed
      ? 'Yes'
      : 'No',

    // Response ID
    'Validation Response ID': address.validated.responseId,
  }))

  console.log(data)
  return (
    <Button onClick={() => saveValidatedAddressesToExcel(data)}>
      {options.buttonText}
    </Button>
  )
}
