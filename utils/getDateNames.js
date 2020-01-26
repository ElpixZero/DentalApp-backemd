const dayjs = require('dayjs');
const ruLocale = require('dayjs/locale/ru');

module.exports = function(date) {
  const comparedDate = getDateParts(new Date(date));
  const currentDate = getDateParts(new Date());


  if (currentDate.year === comparedDate.year && currentDate.month === comparedDate.month) {
    const dayDifference = currentDate.day - comparedDate.day;

    switch(dayDifference) {
      case -1: 
        return 'Завтра'

      case 0:  
        return 'Сегодня'
    }
  }

  return dayjs(date).locale(ruLocale).format('D MMMM');
}

function getDateParts(date) {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  }
}