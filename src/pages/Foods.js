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
  IonModal,
  IonButtons,
  IonCheckbox,
  IonSearchbar
} from '@ionic/react';
import { pizza, trash, closeCircleOutline } from 'ionicons/icons';

import styled from 'styled-components';
import toast from 'react-simple-toasts'
import moment from 'moment'

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Foods = () => {
  const [user] = useGlobal('user')
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [current, setCurrent] = useState(null)
  const [query, setQuery] = useState('')
  const [currentFoods, setCurrentFoods] = useState([])

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
      .collection('foods')
      .doc(current.id)
      .delete()
      .then(res => {
        toast('Registro eliminado', 2000)
      })
  }

  const saveFood = (foods) => {
    firestore.collection('foods')
    .add({
      user: user,
      time: moment().format(),
      foods
    }).then(() => {
      toast('Comida guardada', 3000)
    })
  }

  const selectFoods = () => {
    toast('Selecciona comidas', 3000)
  }

  const refFoods = firestore.collection('foods');
  const { isLoading, data } = useFirestoreQuery(refFoods);

  const listFoods = [
    'Arepa',
    'Avena',
    'Nestun Arroz',
    'Cambur',
    'Arroz',
    'Pollo'
  ]

  const onSearch = (e) => {
    console.log('search: ', e.target.value)
    setQuery(e.target.value)
  }

  const onCheckChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCurrentFoods([...currentFoods, value])
    } else {
      setCurrentFoods(currentFoods.filter(x => x !== value))
    }
  }

  const filterFoods = listFoods.filter( x => x.toLowerCase().indexOf(query) > -1)
  console.log({currentFoods})
  return (
    <IonPage>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Comidas</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}  color="danger">
              <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar onIonChange={onSearch}></IonSearchbar>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            { filterFoods.map(val => (
              <IonItem key={val}>
                <IonLabel>{val}</IonLabel>
                <IonCheckbox onIonChange={onCheckChange} slot="end" value={val} />
              </IonItem>
            )) }
          </IonList>
        </IonContent>
      </IonModal>
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
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={pizza} />
          </IonFabButton>
        </IonFab>
        <IonList>
          <IonListHeader>
            <IonLabel>Últimas comidas</IonLabel>
          </IonListHeader>
          {
            !isLoading ?
            data && data.map(event => {
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
                      <IonLabel>
                        {moment(event.time).format('HH:mm')}
                      </IonLabel>
                    </IonChip>
                   </IonLabel>
                  </IonItem>
                )
              })
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

export default Foods;