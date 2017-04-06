import * as moment from 'moment/moment';

export const dateValid = (date: string) => {
  return moment(date).isValid 
        && moment(date).isBefore(moment())
        && moment(date).year()> 1900;
}