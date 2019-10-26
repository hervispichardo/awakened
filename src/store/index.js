import { setGlobal } from 'reactn'
import setReducers from './reducers'

function makeStore() {
  console.log('Inicializing Store')
  setGlobal({
    user: {
      id: '108286612401480861217',
      displayName: 'Hervis pichardo',
      email: 'hervis15@gmail.com',
      photoURL: "https://lh3.googleusercontent.com/a-/AAuE7mBeddKrjzi92pVZEejMgIR0rNpTcBcRfvytFdOFmQ",
      phoneNumber: null,
    },
    products: null,
    isOpen: false,
    logged: false,
  });

  console.log('Set Reducers')
  setReducers()
}

export default makeStore;

