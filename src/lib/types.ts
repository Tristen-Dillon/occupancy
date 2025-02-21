export type ComponentName = {
  text: string
  languageCode?: string
}

export type AddressComponent = {
  componentName: ComponentName
  componentType: string
  confirmationLevel: string
  inferred?: boolean
}

export type PostalAddress = {
  regionCode: string
  languageCode: string
  postalCode: string
  administrativeArea: string
  locality: string
  addressLines: string[]
}

export type Location = {
  latitude: number
  longitude: number
}

export type Bounds = {
  low: Location
  high: Location
}

export type Geocode = {
  location: Location
  plusCode: {
    globalCode: string
  }
  bounds: Bounds
  placeId: string
  placeTypes: string[]
}

export type Verdict = {
  inputGranularity: string
  validationGranularity: string
  geocodeGranularity: string
  addressComplete: boolean
  hasUnconfirmedComponents: boolean
  hasInferredComponents: boolean
}

export type Address = {
  formattedAddress: string
  postalAddress: PostalAddress
  addressComponents: AddressComponent[]
  unconfirmedComponentTypes: string[]
}

export type Metadata = {
  business: boolean
  poBox: boolean
  residential: boolean
}

export type UspsData = {
  standardizedAddress: {
    firstAddressLine: string
  }
  dpvFootnote: string
  carrierRoute: string
  cassProcessed: boolean
}

export type ValidationResult = {
  verdict: Verdict
  address: Address
  geocode: Geocode
  metadata: Metadata
  uspsData: UspsData
}

export type ValidatedOccupancy = {
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  occupancyPk: string
  occupancyId: string
  validated: {
    result: ValidationResult
    responseId: string
  }
}
