 import moment from "moment";

 export function getFormatedDate(date : string) {
    if(date){
      let formatedDateTime = moment(date).format('DD MMM YYYY, hh:mm A');
      return formatedDateTime;
       }
       else {
         return "NA"
       }  
}

export function getDateWithoutTime(date : string) {
    if(date){
      let formatedDateTime = moment(date).format('MMM DD YYYY');
      return formatedDateTime;
    }
    else {
      return "NA"
    }
}

export function getStringDate (date : number)  {
  if(date){
    const readAbleDate = new Date(date)
   let formatedDateTime = moment(readAbleDate).format('MMM DD YYYY, hh:mm A');
   return formatedDateTime;
  }
  else{
    return "NA"
  }
}

export function getFirstChartByFullName (fullName : any){
  if(fullName){
    var str = fullName
    str = str.split(" "); 
    str = str.filter((res : any  ) => res.length > 0 ); 
    str = str.map(function(res : any){ 
      return res[0].toUpperCase(); 
    }); 
    str = str.join(""); 
    return str; 
  } 
  else {
    return "NA"
  }
 
};

export const CapitalizeFirstLetter = (data : any) => {
  if(data){
    const str = data.charAt(0).toUpperCase() + data.slice(1);
    return str
  }
  else{
    return "NA"
  }
  }

  export function replaceHyphenCapitolize (strData : string){
    if(strData){
      const newStr = strData.charAt(0).toUpperCase() + strData.slice(1);
      let replacedWord = newStr.replace(/-/g, ' ');
      return replacedWord
    }
    else {
      return "NA"
    }
  }

  export function trimObjValues(obj: any) {
    return Object.keys(obj).reduce((acc:any, curr:any) => {
        acc[curr] = obj[curr]
        if (typeof obj[curr] === 'string') {
            acc[curr] = obj[curr].trim()
        }
        return acc;
    }, {});
}

// Calculate An Object Values of key
export function calculateAnObjValues (obj : any) {
  const total = Object.values(obj).reduce((accumulator : any ,currentValue : any) => accumulator + currentValue, 0);
  return total;
};
