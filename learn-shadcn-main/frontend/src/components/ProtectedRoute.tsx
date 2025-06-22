import { Navigate } from 'react-router-dom'
import useDataStore from '@/store/dataStore'

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const authToken = useDataStore((state) => state.authToken)

  if (!authToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
