import React, { useEffect, useGlobal } from 'reactn';
import { authState } from 'rxfire/auth'
import { filter } from 'rxjs/operators';
import firebase, { firestore } from './lib/Firebase'

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { pizza, eye, person } from 'ionicons/icons';
import Login from './pages/Login';
import Home from './pages/Home';
import Foods from './pages/Foods';
import Details from './pages/Details';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App = ({ history }) => {

  const [user, setUser] = useGlobal('user')
  const [logged, setLogged] = useGlobal('logged')

  useEffect(() => {
    authState(firebase.auth())
      .pipe(
        filter(u => u !== null)
    ).subscribe(u => {
      const userData = u.providerData[0];
      const { displayName, email, phoneNumber, photoURL } = userData;
      setUser(userData)

      firestore && firestore
        .collection('users')
        .doc(userData.uid)
        .set({ displayName, email, phoneNumber, photoURL }, { merge: true })
        .then(result => {
          firestore
            .collection('users')
            .doc(userData.uid)
            .get()
            .then(doc => {
              const User = { ...doc.data(), id: doc.id };
              console.log("doc user: ", User)
              setUser(User)
              setLogged(true)
            })
        })
    });
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={Home} exact={true} />
            <Route path="/tab2/details" component={Details} />
            <Route path="/foods" component={Foods} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={eye} />
              <IonLabel>Despertadas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="foods" href="/foods">
              <IonIcon icon={pizza} />
              <IonLabel>Comidas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="login" href="/login">
              <IonIcon icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;


