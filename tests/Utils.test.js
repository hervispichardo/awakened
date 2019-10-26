import { groupByDay } from '../src/lib/Utils'

test('prueba', () => {

  const events = [{
    time: '2019-10-24T22:40:27-03:00'
  },
  {
    time: '2019-10-25T02:40:27-03:00'
  },
  {
    time: '2019-10-25T23:40:27-03:00'
    }]

  const expected = {
    '2019-10-24': [
      {
        day: '2019-10-24',
        time: '2019-10-24T22:40:27-03:00'
      },
      {
        day: '2019-10-24',
        time: '2019-10-25T02:40:27-03:00'
      }
    ],
    '2019-10-25': [
      {
        day: '2019-10-25',
        time: '2019-10-25T23:40:27-03:00'
      }
    ]
  }
  expect(groupByDay(events)).toEqual(expected)
})