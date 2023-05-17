
import { signOut } from 'firebase/auth'
import { auth } from '../firebase-config'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'

const cookies = new Cookies();


const SignOut = (props) => {

  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    props.setIsAuth(false);
    props.setIsRoom(false);
    navigate('/')

  }

  return (
    <div>
      <button className='signout-Button' onClick={logout} >Sign Out</button>
    </div>
  )
}

export default SignOut
