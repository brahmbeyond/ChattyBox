
import { signOut } from 'firebase/auth'
import { auth } from '../firebase-config'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'


const cookies = new Cookies();


const SignOut = (props) => {

  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    props.setIsAuth(false);
    navigate('/')

  }

  return (
    <div>
      <Button color="warning" variant="contained" onClick={logout}
        sx={{ my: 2 }}
      >Sign Out</Button>

    </div>
  )
}

export default SignOut
