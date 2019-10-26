import React, { useGlobal, useState, useEffect } from 'reactn';
import * as R from 'ramda'
import { collectionData } from 'rxfire/firestore'
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
  IonSearchbar,
  IonFooter,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/react';
import { pizza, trash, closeCircleOutline, time, calendar } from 'ionicons/icons';

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
  const [listFoods, setListFoods] = useState([])

  useEffect(() => {
    collectionData(
      firestore.collection('foods').orderBy('name', 'desc'), 'id'
    ).subscribe(data => {
      console.log('foods: ', { data })
      const withChecked = data.map(x => ({...x, checked: false}))
      setListFoods(withChecked)
    })
  }, [])

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
      .collection('ingested')
      .doc(current.id)
      .delete()
      .then(res => {
        toast('Registro eliminado', 2000)
      })
  }

  const saveFood = () => {
    firestore.collection('ingested')
    .add({
      user: user,
      time: moment().format(),
      foods: currentFoods
    }).then(() => {
      toast('Comida guardada', 3000)
      setShowModal(false)
    })
  }



  const refFoods = firestore.collection('ingested');
  const { isLoading, data } = useFirestoreQuery(refFoods);

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

  const filterFoods = listFoods && listFoods.filter( x => x.name.toLowerCase().indexOf(query) > -1)
  console.log({currentFoods})
  return (
    <IonPage>
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Comidas</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => { setShowModal(false); setCurrentFoods([]); }}  color="danger">
              <IonIcon slot="icon-only" icon={closeCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            { filterFoods.map(food => (
              <IonItem key={food.id}>
                <IonLabel>{food.name}</IonLabel>
                <IonCheckbox onIonChange={onCheckChange} slot="end" value={food.name} />
              </IonItem>
            )) }
          </IonList>
        </IonContent>
        <IonFooter>
          <IonButton
            color="primary"
            size="large"
            onClick={() => saveFood()}
            expand="block">
            Guardar
          </IonButton>

        </IonFooter>
      </IonModal>
      <IonActionSheet
        isOpen={showActionSheet}
        header={'Eliminar registro'}
        onDidDismiss={() => close()}
        buttons={[{
            text: 'Eliminar',
            role: 'destructive',
            icon: trash,
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
                  key={event.id}
                  onClick={() => selectItem(event)}
                  detail
                  detailIcon={trash}>
                  <IonLabel>
                    <h3>
                      <IonChip color="primary">
                        <IonIcon icon={calendar} />
                        <IonLabel>
                          {moment(event.time).format('DD-MM')}
                        </IonLabel>
                      </IonChip>
                      <IonChip color="primary">
                        <IonIcon icon={time} />
                        <IonLabel>
                          {moment(event.time).format('HH:mm')}
                        </IonLabel>
                      </IonChip>
                    </h3>
                    <p>
                      {
                        event.foods.map((food, idx) =>
                          <IonChip key={`food-${food}-${idx}`} outline color="secondary">{food}</IonChip>
                        )
                      }
                    </p>
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

// <IonToolbar>
//   <IonSearchbar onIonChange={onSearch}></IonSearchbar>
// </IonToolbar>