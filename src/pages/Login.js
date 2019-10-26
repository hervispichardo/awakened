import React, { useDispatch, useState, useGlobal } from 'reactn';
import firebase, { app } from '../lib/Firebase'
import {
  IonInput,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonAlert,
  IonAvatar,
} from '@ionic/react';
import { book} from 'ionicons/icons';

import './Login.css';

const Login = () => {
  const [user] = useGlobal('user')
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false)
  const [password, setPassword] = useState('');

  const setUser = useDispatch('setUser')

  const signIn = () => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    app
      .auth()
      .signInWithRedirect(authProvider)
      .then(authHandler)
      .catch(error => {
        console.error(error)
        setError(error)
      })
  }

  const authHandler = async (authData) => {
    const userData = authData.user.providerData[0];
    setUser(userData)
  }

  const signOut = async () => {
    await app.auth().signOut()
    setUser(null)
  }


  if (user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonAvatar slot="start">
              <img src={user.photoURL} alt="img profile"/>
            </IonAvatar>
            <IonLabel>{user.displayName}</IonLabel>
        </IonItem>
        </IonContent>
        <IonFooter className="ion-margin-bottom">
          <ion-toolbar>
            <IonButton
              expand="full"
              shape="round"
              onClick={signOut}>
              Desconectarse
            </IonButton>
          </ion-toolbar>
        </IonFooter>
      </IonPage>
    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="ion-margin">
          <IonButton
            shape="round"
            onClick={signIn}>
            With Google
          </IonButton>
        </div>

        <IonItem>
          <IonLabel position="floating">email</IonLabel>
          <IonInput
            name="email"
            value={email}
            onIonChange={(e) => setEmail(e.target.value)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            name="password"
            value={password}
            onIonChange={(e) => setPassword(e.target.value)}></IonInput>
        </IonItem>

      </IonContent>
      <IonFooter className="ion-margin-bottom">
        <ion-toolbar>
          <IonButton
            expand="full"
            shape="round"
            onClick={() => setUser({ email, password })}>
            Crear cuenta
          </IonButton>
        </ion-toolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
