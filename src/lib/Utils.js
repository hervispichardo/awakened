import * as R from 'ramda';
import moment from 'moment'
//Group

const groupProp = attr => R.pipe(
  R.groupBy(R.prop(attr)),
  R.map(R.head),
);

const groupPath = path => R.pipe(
  R.groupBy(R.path(path)),
);

const groupByDay = (events) => {
  const addDay = R.map(event => {
    const day = getDay(event.time);
    return {
      ...event,
      day
    }
  })

  const filterOutRange = R.filter( e => e.day)(addDay(events))

  const result = R.groupBy(R.prop('day'))(filterOutRange)
  return result
}

const getDay = (time) => {
  const isAfterEight = moment(time).hours() >= 22
  const isBeforeTen = moment(time).hours() <= 10
  if (isAfterEight) {
    return `Noche ${moment(time).format('DD-MM')}`
  } else if (isBeforeTen) {
    return `Noche ${moment(time).subtract(1, 'day').format('DD-MM')}`
  } else {
    return `Siesta ${moment(time).format('DD-MM')}`
  }
}

export {
  groupProp,
  groupPath,
  groupByDay
}