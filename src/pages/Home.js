import React, { useGlobal, useState } from 'reactn';
import * as R from 'ramda'
import { groupByDay } from '../lib/Utils'
import { firestore } from '../lib/Firebase'
import { useFirestoreQuery } from '../lib/Hooks'

import {
  IonContent,
  IonHeader,
  IonButton,
  IonChip,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonSkeletonText,
  IonActionSheet,
  IonAvatar,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/react';
import { eye, trash } from 'ionicons/icons';

import styled from 'styled-components';
import toast from 'react-simple-toasts'
import moment from 'moment'

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Home = () => {
  const [user] = useGlobal('user')
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [current, setCurrent] = useState(null)

  const selectItem = (event) => {
    console.log("event: ", event)
    setCurrent(event)
    setShowActionSheet(true)
  }

  const close = () => {
    setShowActionSheet(false)
    setCurrent(null)
  }

  const onDelete = () => {
    firestore
      .collection('awake')
      .doc(current.id)
      .delete()
      .then(res => {
        toast('Registro eliminado', 2000)
      })
  }

  const onSetUser = () => {
    firestore
      .collection('awake')
      .doc(current.id)
      .update({
        user: user
      })
      .then(res => {
        toast('Registro Actualizado', 2000)
      })
  }

  const awakened = () => {
    firestore.collection('awake')
    .add({
      user: user,
      time: moment().format()
    }).then(() => {
      toast('Hora de despertada guardada', 3000)
    })
  }

  const ref = firestore.collection('awake');
  const { isLoading, data } = useFirestoreQuery(ref);
  console.log({data, user})

  return (
    <IonPage>
    <IonActionSheet
      isOpen={showActionSheet}
      header={'Eliminar registro'}
      onDidDismiss={() => close()}
      buttons={[{
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            onDelete()
          }
        },{
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      }
    >
  </IonActionSheet>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={awakened}>
            <IonIcon icon={eye} />
          </IonFabButton>
        </IonFab>
        <IonList>
          <IonListHeader>
            <IonLabel>Últimas despertadas</IonLabel>
          </IonListHeader>
          {
            !isLoading ?
              R.pipe(
                R.toPairs,
                R.map(([day, childrens]) => {
                  return(
                    <IonItemGroup>
                      <IonItemDivider>
                        <IonLabel>
                          {day}
                          <IonChip>
                            <IonLabel>{childrens.length}</IonLabel>
                          </IonChip>
                        </IonLabel>
                      </IonItemDivider>
                      {
                        childrens.map(event => {
                          return (
                            <IonItem
                              detail
                              detailIcon={trash}
                              onClick={() => selectItem(event)}>
                              <IonLabel>
                                <IonChip>
                                  <IonAvatar>
                                    <img
                                      src={event.user.photoURL}
                                      alt="img profile" />
                                  </IonAvatar>
                                  <IonIcon icon={eye} />
                                  <IonLabel>
                                    {moment(event.time).format('HH:mm')}
                                  </IonLabel>
                                </IonChip>
                               </IonLabel>
                            </IonItem>
                          )
                        })
                      }
                    </IonItemGroup>
                  )
                 }))(groupByDay(data))
            : <ListSkeleton />
          }

        </IonList>
      </IonContent>
    </IonPage>
  );
};

const ListSkeleton = () => {
  return (
    <IonList>
      <IonProgressBar type="indeterminate"></IonProgressBar>
      <IonItem>
        <IonSkeletonText animated style={{ width: '88%' }} />
      </IonItem>
      <IonItem>
        <IonSkeletonText animated style={{ width: '88%' }} />
      </IonItem>
      <IonItem>
        <IonSkeletonText animated style={{ width: '88%' }} />
      </IonItem>
    </IonList>

  )
}

export default Home;