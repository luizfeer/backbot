import { menu, additionalMenu } from './server'

const natural = require('natural');

export async function cardapio(app, message){
    // console.log(menuData)
    const menuData = await menu(app)
    let string  
    let item = menuData[0]
    let itemAux = 0
    let aux
    console.log('mensagem:', message)
    for(var i=0; i<menuData.length; i++) {
        if(message.length<4){
             string = `${menuData[i].code}`
             //se for curto é o id do produto
        }else{
             string = `${menuData[i].keywords}`
             //se for maior usa o keyword
        }
       aux = natural.JaroWinklerDistance(string, message.toLowerCase())
       console.log(aux, string)
       if(aux > itemAux){

           item = menuData[i]
           itemAux = aux
       }
    }
    if(itemAux > 0.7){
      console.log(itemAux)
      return { sucess: true, item } 
    }else{
      return { sucess: false }
    }
  }
  export async function searchAdditional(app, message, id_service){
    // console.log(menuData)
    const menuData = await additionalMenu(app, id_service)
    let string  
    let item = menuData[0]
    let itemAux = 0
    let aux
    console.log('mensagem:', message)
    for(var i=0; i<menuData.length; i++) {
        if(message.length<4){
             string = `${menuData[i].code}`
             //se for curto é o id do produto
        }else{
             string = `${menuData[i].keywords}`
             //se for maior usa o keyword
        }
       aux = natural.JaroWinklerDistance(string, message.toLowerCase())
       console.log(aux, string)
       if(aux > itemAux){

           item = menuData[i]
           itemAux = aux
       }
    }
    if(itemAux > 0.7){
      console.log(itemAux)
      return { sucess: true, item } 
    }else{
      return { sucess: false }
    }
  }
  export async function verifyString(message, compareArray){
    // console.log(compareArray)
    let string  
    let item = compareArray[0]
    let itemAux = 0
    let aux
    console.log('mensagem:', message)
    for(var i=0; i<compareArray.length; i++) {
        if(message.length<3){
             string = `${compareArray[i].code}`
             //se for curto é o id do produto
        }else{
             string = `${compareArray[i].keywords}`
             //se for maior usa o keyword
        }
       aux = natural.JaroWinklerDistance(string, message.toLowerCase())
       console.log(aux, string)
       if(aux > itemAux){
           item = compareArray[i]
           itemAux = aux
       }
    }
    if(itemAux > 0.7){
      console.log(itemAux)
      return { sucess: true, item } 
    }else{
      return { sucess: false }
    }
  }

  export function verify(message, keys){
    const msgArray =  message.split(" ")      
    for(var i=0; i<msgArray.length; i++) {        
      if(keys.includes(msgArray[i].toLowerCase())){
        return true          
      }
    } 
    return false
}