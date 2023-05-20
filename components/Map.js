import { useEffect, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import { UberContext } from '../context/uberContext'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const Map = () => {
  const { pickupCoordinates, dropoffCoordinates } = useContext(UberContext)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph',
      center: [-99.29011, 39.39172],
      zoom: 3,
    })

    if (pickupCoordinates) {
      addToMap(map, pickupCoordinates)
    }

    if (dropoffCoordinates) {
      addToMap(map, dropoffCoordinates)
    }

    if (pickupCoordinates && dropoffCoordinates) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(pickupCoordinates)
        .extend(dropoffCoordinates)

      map.fitBounds(bounds, { padding: 100 })

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        interactive: false,
      })

      const directionsContainer = document.getElementById(
        'directions-container'
      )
      const distanceContainer = document.createElement('div')
      distanceContainer.classList.add('distance-container')

      directions.on('route', ({ route }) => {
        if (route.length > 0) {
          const distance = route[0].distance
          const distanceContainer = document.createElement('div')
          distanceContainer.classList.add('distance-container')
          distanceContainer.innerHTML = `Total distance: ${(distance / 1000).toFixed(1)} km`
      
          const directionsContainer = document.getElementById('directions-container')
          directionsContainer.innerHTML = ''
          directionsContainer.appendChild(distanceContainer)
        }
      })

      directionsContainer.appendChild(distanceContainer)
      map.addControl(directions, 'top-left')

      directions.setOrigin(pickupCoordinates)
      directions.setDestination(dropoffCoordinates)
    }
  }, [pickupCoordinates, dropoffCoordinates])

  const addToMap = (map, coordinates) => {
    const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map)
  }

  return (
    <>
      <div style={{ height: '100%', width: '100%' }} id='map' />
      <div id='directions-container' />
    </>
  )
}

export default Map
