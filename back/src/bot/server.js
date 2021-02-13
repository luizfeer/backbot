import { updateName, existUser, saveNumber, changeStage, changeAux, saveService, saveProduct, activeLastProduct, saveAddress, activeLastAddress } from '../user/functions';
import { getMenu, getProduct, getOrder, activeAddressService, getOrderValue, saveCloseOrder, savePaymentCredit, savePaymentPix, savePaymentChange, getMenuAdditional, saveAdditional, getOrderAdditional } from '../order/functions';
import moment from 'moment'
// require('dotenv').config()

export async function getUser(app, number) {
  // console.log("n:", number)
  const user = await existUser(app, number)
  console.log('user', user)    
  if(user.sucess){
    //user existe, o retorna   
    // const user = await getService(app, number)
    return user.data[0]
  } else {
    //caso nao exista cria um novo e retorna-o
    let newUser = await saveNumber(app, number)
    if(newUser.sucess){
      newUser = newUser.data[0]
      // console.log('newuser:', newUser)
      return newUser
    }
  }
  return 404;
};

export async function newService(app, id){
  
  const service = await saveService(app, id)
  console.log(service)
  if(service.sucess){
    return service.data[0]
  }
  return 404;
}

export async function newProduct(app, id_service, id_product, status){
  
  const product = await saveProduct(app, id_service, id_product, status)
  console.log(product)
  if(product.sucess){
    return product.data[0]
  }
  return 404;
}
export async function newAdditional(app, id_service, id_additional, id_sp){  
  const product = await saveAdditional(app, id_service, id_additional, id_sp)
  console.log(product)
  if(product.sucess){
    return product.data[0]
  }
  return 404;
}

export async function activeProduct(app, id_service){  
  const product = await activeLastProduct(app, id_service)
  console.log('active?',product)
  if(product.sucess){
    return product.data[0]
  }
  return 404;
}
export async function orderValueTotal(app, id_service){  
  const value = await getOrderValue(app, id_service)
  console.log(value.data.rows[0].total)
  if(value.sucess){
    return value.data.rows[0].total
  }
  return 404;
}

export async function closeOrder(app, id_service){  
  const order = await saveCloseOrder(app, id_service)
  console.log(order)
  if(order.sucess){
    return order.data[0]
  }
  return 404;
}
export async function paymentCredit(app, boolean, id_service){  
  const result = await savePaymentCredit(app, boolean, id_service)
  console.log(result)
  if(result.sucess){
    return result.data[0]
  }
  return 404;
}
export async function paymentPix(app, boolean, id_service){  
  const result = await savePaymentPix(app, boolean, id_service)
  console.log(result)
  if(result.sucess){
    return result.data[0]
  }
  return 404;
}
export async function paymentChange(app, value, id_service){  
  const result = await savePaymentChange(app, value, id_service)
  console.log(result)
  if(result.sucess){
    return result.data[0]
  }
  return 404;
}


//address
export async function newAddress(app, id, address){
  const dataAddress = await saveAddress(app, id, address)
  console.log(dataAddress)
  if(dataAddress.sucess){
    return dataAddress.data[0]
  }
  return 404;
}
export async function activeAddress(app, id){  
  const address = await activeLastAddress(app, id)
  console.log(address)
  if(address.sucess){
    return address.data[0]
  }
  return 404;
}
export async function saveAddressService(app, id_service, id_address) {  
  const address = await activeAddressService(app, id_service, id_address) 
  console.log(address)
  if(address.sucess){
    return address.data[0]
  }
  return 404;
}
//name

export async function saveName(app, number,  name) {
    const save = await updateName(app, number, name) 
    if(save.sucess){
      return true     
    }
  return false;
};

export async function stageIncrement(app, number, stage) {
  const save = await changeStage(app, number, stage+1) 
  if(save.sucess){
    return true     
  }
return false;
};

export async function stageDecrement(app, number, stage) {
  const save = await changeStage(app, number, stage-1) 
  if(save.sucess){
    return true     
  }
return false;
};
export async function setStage(app, number, num) {
  const save = await changeStage(app, number, num) 
  if(save.sucess){
    return true     
  }
return false;
};


export async function saveAux(app, number, aux) {
  const save = await changeAux(app, number, aux) 
  if(save.sucess){
    return true     
  }
  console.log('save', save)
return false;
};


//products
export async function menu(app) {
  const data = await getMenu(app) 
  if(data.sucess){
    return data.data  
  }
  return false
};
export async function additionalMenu(app, id_service) {
  let products = await getMenuAdditional(app, id_service)
  if(products.sucess){
    return products.data  
  }
  return false
};

export async function menuFormated(app){
  let products = await getMenu(app)
  products = products.data
  let msg = "🚨  CARDÁPIO  🚨\n\n"  
  Object.keys(products).map(value => {
    console.log(products[value].code)
    if (products[value].code === '301') {
      msg += `🧃 Bebidas\n`
    }
    if (products[value].code === '400') {
      msg += `\n🍗 Frango Frito\n`
    }
    if (products[value].code === '410') {
      msg += `\n🍟 Batata Frita\n`
    }
    if (products[value].code === '420') {
      msg += `\n🍮 Sobremesas\n`
    }
    
    // } else if (value === '2') {
    //   msg += `2️⃣ - _${products[value].name}_ \n`
    // } else if (value === '3') {
    //   msg += `3️⃣ - _${products[value].name}_ \n`
    // } else if (value === '4') {
    //   msg += `4️⃣ - _${products[value].name}_ \n`
    // } else if (value === '5') {
      // }
      // msg += `*${products[value].code}* - ${products[value].name} \n`
      msg += `  *${products[value].code}* - ${products[value].name} \n`
  });
  msg += `\n- Envie o código ou nome do produto que deseja pedir!\n\`\`\`E somente um pedido por vez\`\`\``
  return msg
} 

export async function menuAdditionalFormated(app, id_service){
  let products = await getMenuAdditional(app, id_service)
  console.log(products)
  products = products.data
  let name = products[0].nameproduct
  let msg = '' 
  Object.keys(products).map(value => {
      msg += `*${products[value].code}* - ${products[value].name} \n`
  });
  msg += `*0* - Nenhum\n`
  return { msg, name }
} 

export async function orderFormated(app, id_service){
  let products = await getOrder(app, id_service)
  let additional = await getOrderAdditional(app, id_service)
  products = products.data.rows
  additional = additional.data.rows
  console.log('add',additional)
  let msg = "🚨  Seu pedido \n\n"  
  let total = 0
  Object.keys(products).map(value => {
    total += products[value].price
    let price = (products[value].price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    msg += `${products[value].amount} - ${products[value].name} : *${price}*\n`
    Object.keys(additional).map(index => {
      if(additional[index].id_sp === products[value].id_sp){
        msg += `      +${additional[index].name} : *${additional[index].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}*\n`
        total += additional[index].price
      }
    })
  });
  msg += `\n- Total: ${(total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}\n`
  return msg
} 

export async function resumeOrder(app, id_service){
  let products = await getOrder(app, id_service)
  products = products.data.rows
  // console.log(products)
  function tracert(string){
    let space = ""
    let calc = 35-string.length
    if(calc>0){
      for(var i=0; i<calc; i++){
        space +="_"
      }
    }
    return space
  }
  let msg = ""
  let total = 0
  Object.keys(products).map(value => {
    total += products[value].price
    let price = (products[value].price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    msg += `*${products[value].amount}x   ${products[value].name}*\n${tracert(price)}\`\`\`${price}\`\`\`\n\n`
  });
  total = (total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
  msg += `\n*TOTAL:*\n${tracert(total)}\`\`\`${total}\`\`\`\n`
  return msg
} 

export async function product(app, code) {
  const data = await getProduct(app, code) 
  if(data.sucess){
    console.log('get', data)
    return data.data
  }
  return false
};



// create().then((client) => start(client));

// async function start(client) {
//   await client.onMessage(async (message) => {
//     const user = getStage(message.from);
//     const resp = stages[user].stage.exec({user: message.from, message: message.body, client});
//     if (user === 4) {
//       await client.sendText(secundary_number, resp);
//       await client.sendText(message.from, '✅ *Prontinho, pedido feito!* \n\nAgora, se você ainda não sabe o valor da taxa de entrega para sua região, vou te passar para um atendente para que ele verique o valor da *taxa de entrega*. \n\n⏳ *Aguarde um instante*.');
//     } else if (user === 5) {
//       await client.markUnseenMessage(message.from);
//     } else {
//       await client.sendText(message.from, resp);
//     }
//   })
//   // close the connection with the client correctly  
//   process.on('SIGINT', function() {
//     console.log('oi');
//     client.close();
//   });
// }



