import { Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'


const Dashboard = () => {
    const { user } = useAuth()
  return (
      <Box>
          User information: {user ? <h1>{user.email}</h1> : <h1>"Not logged In"</h1>}
      </Box>
  )
}

export default Dashboard