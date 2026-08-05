import dayjs from "dayjs";


export function formatDate(date){

    if(!date){
        return "Not announced";
    }

    return dayjs(date).format(
        "MMM D, YYYY"
    );

}