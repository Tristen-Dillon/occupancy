import { getDistanceFromLatLonInMeters } from '@/lib/utils'
import type { CollectionConfig, PayloadRequest } from 'payload'

export const Markers: CollectionConfig = {
  slug: 'markers',
  access: {
    read: () => true,
    update: () => true,
    delete: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'dataset',
      type: 'select',
      options: ['fmp', 'google'],
      index: true,
      required: true,
    },
    {
      name: 'location',
      type: 'group',
      index: true,
      fields: [
        {
          name: 'lat',
          type: 'number',
          index: true,
        },
        {
          name: 'lng',
          type: 'number',
          index: true,
        },
      ],
    },
    {
      name: 'occupancyPk',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'occupancyId',
      type: 'text',
    },
    {
      name: 'distance',
      type: 'number',
    },
    {
      name: 'occupancy',
      type: 'relationship',
      relationTo: 'occupancy',
      hasMany: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, context, operation }) => {
        if (operation === 'create') return data
        if (context.distanceUpdated) return
        const brother = await req.payload.find({
          collection: 'markers',
          where: {
            and: [
              {
                occupancyPk: {
                  equals: data.occupancyPk,
                },
              },
              {
                dataset: {
                  not_equals: data.dataset,
                },
              },
            ],
          },
        })
        if (!brother.docs[0].location) return data
        if (!data.location) return data
        if (!brother.docs[0].location.lat || !brother.docs[0].location.lng) return data
        const distance = getDistanceFromLatLonInMeters(
          data.location.lat,
          data.location.lng,
          brother.docs[0].location.lat,
          brother.docs[0].location.lng,
        )
        if (brother.docs[0].distance && brother.docs[0].distance === distance)
          return {
            ...data,
            distance: distance,
          }
        await req.payload.update({
          collection: 'markers',
          id: brother.docs[0].id,
          data: {
            distance: distance,
          },
          context: {
            distanceUpdated: true,
          },
        })
        return {
          ...data,
          distance: distance,
        }
      },
    ],
    // afterChange: [
    //   async ({ doc, req, context }) => {
    //     console.log('CONTEXT: ', context)
    //     console.log('DOCID: ', doc.id)
    //     console.log('updating distance')
    //     if (context.distanceUpdated) return
    //     const brother = await req.payload.find({
    //       collection: 'markers',
    //       where: {
    //         occupancyPk: {
    //           equals: doc.occupancyPk,
    //         },
    //         // and: [
    //         //   {
    //         //     occupancyPk: {
    //         //       equals: doc.occupancyPk,
    //         //     },
    //         //   },
    //         //   {
    //         //     id: {
    //         //       not_equals: doc.id,
    //         //     },
    //         //   },
    //         // ],
    //       },
    //     })
    //     console.log('BROTHER: ', brother.docs[0].id)
    //     if (!brother.docs[0].location) return
    //     if (!doc.location) return
    //     if (!brother.docs[0].location.lat || !brother.docs[0].location.lng) return
    //     const distance = getDistanceFromLatLonInMeters(
    //       doc.location.lat,
    //       doc.location.lng,
    //       brother.docs[0].location.lat,
    //       brother.docs[0].location.lng,
    //     )
    //     console.log('DISTANCE: ', distance)
    //     await req.payload.update({
    //       collection: 'markers',
    //       id: doc.id,
    //       data: {
    //         distance: distance,
    //       },
    //       context: {
    //         distanceUpdated: true,
    //       },
    //     })
    //     await req.payload.update({
    //       collection: 'markers',
    //       id: brother.docs[0].id,
    //       data: {
    //         distance: distance,
    //       },
    //       context: {
    //         distanceUpdated: true,
    //       },
    //     })
    //     console.log('UPDATED')
    //     return {
    //       ...doc,
    //       distance: distance,
    //     }
    //   },
    // ],
  },
  endpoints: [
    {
      path: '/get-markers-in-bounds',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        const { ne_lat, ne_lng, sw_lat, sw_lng, distance, page } = req.query

        const markers = await req.payload.find({
          collection: 'markers',
          where: {
            'location.lat': { less_than_equal: ne_lat, greater_than_equal: sw_lat },
            'location.lng': { less_than_equal: ne_lng, greater_than_equal: sw_lng },
            distance: { greater_than_equal: distance },
          },
          limit: 500,
          page: page ? parseInt(page as string) : undefined,
        })

        // console.log(markers)
        return new Response(JSON.stringify(markers), {
          status: 200,
        })
      },
    },
  ],
}
