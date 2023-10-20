import { useLocation, Location } from 'react-router-dom'

interface AppLocation extends Location {
  state: unknown
}

const useAppLocation: () => AppLocation = useLocation

export default useAppLocation
