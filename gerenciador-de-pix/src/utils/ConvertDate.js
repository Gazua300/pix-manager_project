export const convertDate = (date) => {
    const day = date.substring(8, 10)
    const month = date.substring(5, 7)
    const year = date.substring(0, 4)
    return `${day}/${month}/${year}`
}


export const convertHour = (date)=>{
    const hour = date.substring(11, 19)
    
    return hour
}