function dateToHourAndMinute(date){
    date = new Date(date);
    let hours = date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let ret = '';

    if((hours >= 12)){
        ret = `${hours-12}:${minutes} PM`;
    }else{
        ret = `${hours}:${minutes} AM`;
    }
    return ret;
}


export { dateToHourAndMinute }