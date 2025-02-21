import { requestToBodyStream } from 'next/dist/server/body-streams'
import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Occupancy as OccupancyType } from '../payload-types'
import { getDistanceFromLatLonInMeters } from '@/lib/utils'
export const Occupancy: CollectionConfig = {
  slug: 'occupancy',
  access: {
    read: () => true,
    update: () => true,
    delete: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'lat',
          type: 'number',
        },
        {
          name: 'lng',
          type: 'number',
        },
      ],
    },
    {
      name: 'occupancyPk',
      type: 'text',
      required: true,
    },
    {
      name: 'occupancyId',
      type: 'text',
    },
    {
      name: 'validated',
      type: 'json',
      required: true,
    },
    {
      name: 'markers',
      type: 'join',
      collection: 'markers',
      on: 'occupancy',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation !== 'create') {
          return
        }

        setTimeout(() => createMarkers(doc, req), 1000)
      },
    ],
  },
  endpoints: [
    {
      path: '/:id/fix-markers',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        const { id } = req.routeParams as { id: string }
        if (!id) {
          return Response.json({ error: 'ID is required' }, { status: 400 })
        }

        const occupancy = await req.payload.findByID({
          collection: 'occupancy',
          id: id as string,
        })
        if (!occupancy) {
          return Response.json({ error: 'Occupancy not found' }, { status: 404 })
        }
        await createMarkers(occupancy, req)
        return Response.json({ message: 'Markers fixed' }, { status: 200 })
      },
    },
    {
      path: '/upload',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        try {
          const body = await req.json?.()
          const occupancies = body.data

          const encoder = new TextEncoder()

          const stream = new ReadableStream({
            async start(controller) {
              try {
                for (const [index, occupancy] of occupancies.entries()) {
                  let location = occupancy.location

                  if (location.lat === 0 || location.lng === 0 || !location.lat || !location.lng) {
                    location = occupancy.validated.result.geocode.location
                  }
                  validateOccupancy(occupancy, index)
                  const newOccupancy = await req.payload.create({
                    collection: 'occupancy',
                    data: {
                      ...occupancy,
                      location: location,
                    },
                  })

                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ ...newOccupancy, index })}\n\n`),
                  )
                }
              } catch (error) {
                console.error(error)
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: 'Stream Error' })}\n\n`),
                )
              } finally {
                controller.close()
              }
            },
          })

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          })
        } catch (e) {
          console.error(e)
          return Response.json(
            {
              error: 'Something went wrong',
              stacktrace: String(e),
            },
            { status: 500 },
          )
        }
      },
    },
  ],
}

const createMarkers = async (doc: any, req: PayloadRequest) => {
  console.log('DOC', doc)
  const location = doc.validated.result.geocode.location
  if (!location) {
    return
  }

  const distance = getDistanceFromLatLonInMeters(
    doc.location.lat ?? location.latitude,
    doc.location.lng ?? location.longitude,
    location.latitude,
    location.longitude,
  )
  await req.payload.create({
    collection: 'markers',
    data: {
      occupancy: doc.id,
      dataset: 'fmp',
      occupancyPk: doc.occupancyPk,
      occupancyId: doc.occupancyId,
      location: {
        lat: doc.location.lat ?? location.latitude,
        lng: doc.location.lng ?? location.longitude,
      },
      distance: distance,
    },
  })
  await req.payload.create({
    collection: 'markers',
    data: {
      occupancy: doc.id,
      dataset: 'google',
      occupancyPk: doc.occupancyPk,
      occupancyId: doc.occupancyId,
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
      distance: distance,
    },
  })
}

function validateOccupancy(occupancy: any, index: number) {
  const missing = []
  for (const property of [
    'name',
    'address',
    'location',
    'occupancyPk',
    'occupancyId',
    'validated',
  ] as Array<keyof OccupancyType>) {
    if (!occupancy[property]) {
      missing.push(property)
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required properties: ${missing.join(', ')} in occupancy index ${index}`,
    )
  }
  if (!occupancy.occupancyPk) {
    throw new Error('occupancyPk is required')
  }
}
