import { addReducer } from 'reactn';


function setMainReducer() {

  addReducer('setUser', (state, dispatch, payload) => ({
    user: payload
  }));

}

export default setMainReducer