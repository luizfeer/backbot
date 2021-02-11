import moment from 'moment'

import { getUser, stageIncrement, stageDecrement, saveName, saveAux, menu, product, setStage, menuFormated, menuAdditionalFormated, newService, newProduct, activeProduct, orderFormated, orderValueTotal, newAddress, activeAddress, saveAddressService, paymentCredit, paymentPix, closeOrder, resumeOrder, paymentChange, newAdditional } from './server'

import { verify, cardapio, verifyString, searchAdditional } from './strings'

const respTrue = ['sim', 's', 'isso', 'certo'];
const respFalse = ['não', 'n', 'nao', 'mudar', 'corrigir', 'cancelar'];
const respClose = ['finalizar', 'finaliza', 'finalize', 'termina', 'fecha', 'conclui'];


export async function step(app, number, message, client) {
  // console.log("N: ",number)

  const user = await getUser(app, number);
  let stage = user.stage

  //bavalia o antendimento
  if (stage > 3) {//só se ja tiver nome :)
    if (user.service_updated_at) {
      //tem um atendimento aberto
      console.log('dat', moment().diff(user.service_updated_at, 'hours'))
      if (moment().diff(user.service_updated_at, 'hours') > 10) {
        stage = 201
        //201 old service
      }
    }
    else {
      //não tem
      stage = 200
      //200 new service     
    }
  }




  // console.log("N: ",number, "stage: ",stage, "user: ", user)
  console.log("stage: ", stage)

  if (stage == 200) {
    try {
      await setStage(app, number, 4)
      let save = await newService(app, user.id_user);
      console.log(save)
      let dataMenu = await menuFormated(app)
      client.sendText(number,
        `Olá ${user.name}, estou iniciando um novo atendimento, e já vou anotar seus pedidos, segue o cardapio!\n${dataMenu}`);
    } catch (msg) {
      console.log(msg)
    }
  }
  if (stage == 201) {
    try {
      await setStage(app, number, 4)
      let save = await newService(app, user.id_user);
      console.log(save)
      let dataMenu = await menuFormated(app)
      client.sendText(number,
        `Olá ${user.name}, bem vindo de volta, estou abrindo um novo atendimento ok?!\nJá pode me enviar seu pedido, estou aqui para anotar!\n${dataMenu}`);
    } catch (msg) {
      console.log(msg)
    }
  }
  if (stage === 0) {
    try {
      client.sendText(number, `Olá ${message.sender.pushname === undefined ? '' : message.sender.pushname}, bem vindo! Para iniciarmos seu atendimento, por favor, me envie uma menssagem contendo somente seu nome completo.\n*Ex:* Maria Silva Borba`);
      await stageIncrement(app, number, stage)
    } catch (msg) {
      console.log(msg)
    }
  }

  if (stage === 1) {
    try {
      client.sendText(number, `Seu nome completo é:\n${message.body}\nEstá correto? Responda com *sim* ou *não*.`);
      await saveName(app, number, message.body)
      await saveAux(app, number, message.sender.pushname)

    } catch (msg) {
      console.log("erro:", msg)
    }
  }

  if (stage === 2) {
    try {
      if (verify(message.body, respTrue)) {
       try {
          await setStage(app, number, 4)
          let save = await newService(app, user.id_user);
          console.log(save)
          let dataMenu = await menuFormated(app)
          client.sendText(number,
            `Olá ${user.name}, seu nome foi salvo com sucesso! Estou iniciando um novo atendimento, e já vou anotar seus pedidos, segue o cardapio!\n${dataMenu}`);
        } catch (msg) {
          console.log(msg)
        }

      } else {
        await stageDecrement(app, number, stage)
        client.sendText(number, `Ok, envie a próxima menssagem contendo somente seu nome completo.\n
        *Ex:* Maria Silva Borba`);
      }
    } catch (msg) {
      console.log(msg)
    }
  }
  if (stage === 3) {
    await stageDecrement(app, number, stage)
    client.sendText(number, `Ok, envie a próxima menssagem contendo somente seu nome completo.\n
    *Ex:* Maria Silva Borba`);
  }
  if (stage === 4) {
    //busca pelo produto
    try {
      if (verify(message.body, respClose)) {
        await setStage(app, number, 6)
        client.sendText(number, `Ok, fechei seu pedido! Quando ficar pronto você quer?\n1 - Retirar na loja?\n2 - Receber em casa (Delivery)?`);
      } else {

        // let dataMenu = await menuFormated(app)
        //procura o pela srting
        let productData = await cardapio(app, message.body)
        console.log('pd:',productData)
        if (productData.sucess) {
          if (productData.item.additional) {
            await setStage(app, number, 50)
          }else{
            await setStage(app, number, 5)
          }
          await newProduct(app, user.id_service, productData.item.id_product)
          client.sendText(number, `Certo, você deseja pedir ${productData.item.description_menu}?\n\n1- Sim\n2-Não?`);
          console.log('productData', productData.item)
        } else {
          client.sendText(number, `Desculpe, não entedi, seja específico e peça um produto por vez!`);
        }
      }
      // await stageIncrement(app, number, stage)
      // client.sendText(number, menuFormated(app)); 

    } catch (msg) {
      console.log(msg)
    }

  }
  if (stage === 5) {
    //sim ou nao do produto
    let compareArray = [
      { code: 1, keywords: "sim" },
      { code: 2, keywords: "não" }
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && resp.item.code === 1) {
          //casa

      await stageDecrement(app, number, stage)
      await activeProduct(app, user.id_service)
      let dataOrder = await orderFormated(app, user.id_service)

      client.sendText(number, `Produto anotado!\n\n${dataOrder}\nVocê pode continuar pedindo pelo nome ou código dos produtos, ou pode enviar:\n*finalizar*`);

      // }else if(verify(message.body, respFalse)){
    } else {
      //cancelar
      let dataMenu = await menuFormated(app)
      await stageDecrement(app, number, stage)
      client.sendText(number, `Cancelei esse item do seu pedido, mas me envie o produto que você deseja pedir!\n\n${dataMenu}\n`);

    }
  }
  //produto com adicional
  if(stage === 50){
    let compareArray = [
      { code: 1, keywords: "sim" },
      { code: 2, keywords: "não" }
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && resp.item.code === 1) {
        
      await setStage(app, number, 51)

      await activeProduct(app, user.id_service)
      
      let additional = await menuAdditionalFormated(app, user.id_service)

      client.sendText(number, `Produto anotado! ${additional.name} possui os seguintes adicionais:\n${additional.msg}\nQual adicional deseja? Envie um por vez!`);

      // }else if(verify(message.body, respFalse)){
    } else {
      //cancelar
      let dataMenu = await menuFormated(app)
      await setStage(app, number, 4)
      client.sendText(number, `Cancelei esse item do seu pedido, mas me envie o produto que você deseja pedir!\n\n${dataMenu}\n`);

    }
  }
  if(stage === 51){
    let compareArray = [
      { code: 0, keywords: "nenhum" },
      { code: '#', keywords: "não" }
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && (resp.item.code === 0 || resp.item.code === '#')) {
      await setStage(app, number, 4)

      let dataOrder = await orderFormated(app, user.id_service)

      client.sendText(number, `Ok, você pode continuar pedindo pelo nome ou código dos produtos, ou pode enviar:\n*finalizar*\n\n${dataOrder}\n`);

      // }else if(verify(message.body, respFalse)){
    } else {
      //cancelar
      let productData = await searchAdditional(app, message.body, user.id_service)
      if (productData.sucess) {        
               
        let aa = await newAdditional(app, user.id_service, productData.item.id_additional, productData.item.id_sp)      
        console.log(aa)
     
        client.sendText(number, `*${productData.item.name}* adicionado!\nMais algum adicional? Envie o adicional ou *não*.`);
        
      } else {
        client.sendText(number, `Desculpe, não entedi, seja específico e peça um adicional por vez!`);
      }
    
    }
  }
  
  if (stage === 6) {
    //retirar ou delivery
    let compareArray = [
      { code: 1, keywords: "buscar loja" },
      { code: 2, keywords: "casa delivery" }
    ]
    let resp = await verifyString(message.body, compareArray)
   

    console.log('resp', resp)

    if (resp.sucess && resp.item.code === 1) {
   

    //buscar na loja
       let value = await orderValueTotal(app, user.id_service)
      await setStage(app, number, 10)
      client.sendText(number, `Ok, então você pode retirar com a gente! Assim que estiver pronto te enviaremos uma mensagem e você pode retirar aqui.\nNosso Endereço: R: de André Lourenço N 160\nSeu pedido ficou em ${value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}, como você deseja pagar?\n1- No dinheiro\n2- No cartão?`);     

    } else if (resp.sucess && resp.item.code === 2) {
      await newProduct(app, user.id_service, 15, true)//taxa de entrega
      //delivery
      if (user.id_address) {
        //existe endereço
        await setStage(app, number, 7)
        client.sendText(number, `Receber em casa é melhor né? Vi que já tenho um endereço seu aqui. Você quer receber em:\n${user.address}?\n1 - Sim\n2- Outro endereço`);
      } else {
        //não tem endereço
        await setStage(app, number, 8)
        client.sendText(number, `Receber em casa é mais confortável né? Mas antes preciso do seu endereço, me envie na proxima mensagem seu endereço completo!\nExemplo: Rua 7 detembro, número 8, conceição da aparecida.`);
      }
    } else {
      client.sendText(number, `Não entendi, escolha uma opção! Quando ficar pronto você quer?\n1 - Buscar na loja?\n2 - Receber em casa (Delivery)?`);
    }
  }

  if (stage === 7) {
    //mesmo endereço ou novo
    let compareArray = [
      { code: 1, keywords: "sim" },
      { code: 2, keywords: "outro endereço" }
    ]
    let resp = await verifyString(message.body, compareArray)
    console.log('resp', resp)
    if (resp.sucess && resp.item.code === 1) {
      //sim endereço ja cadastrado
      await saveAddressService(app, user.id_service, user.id_address)
      await setStage(app, number, 10)
      let value = await orderValueTotal(app, user.id_service)
      console.log(value)
      client.sendText(number, `Ok, anotei seu endereço, seu pedido ficou em ${value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}, como você deseja pagar?\n1- No dinheiro\n2- No cartão?\n3- Com PIX?`);
    } else if (resp.sucess && resp.item.code === 2) {
      //endereço novo
      await setStage(app, number, 8)
      client.sendText(number, `Certo, agora me envie em uma unica frase o endereço completo.\nExemplo: Rua 7 setembro, número 8.`);

    } else {
      client.sendText(number, `Não entendi! Responda com uma opção, você quer receber em:\n${user.address}?\n1 - Sim\n2 - Outro endereço`);;
    }
  }
  if (stage === 8) {
    //confirma endereço endereço ou novo
    await newAddress(app, user.id_user, message.body)
    await setStage(app, number, 9)
    client.sendText(number, `Seu endereço completo é:\n${message.body}?\n1- Sim\n2- Não`);
  }
  if (stage === 9) {
    //mesmo endereço ou novo
    let compareArray = [
      { code: 1, keywords: "sim" },
      { code: 2, keywords: "não" }
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && resp.item.code === 1) {
      //endereço ok
      
      await activeAddress(app, user.id_user)
      await saveAddressService(app, user.id_service, user.id_address)
      await setStage(app, number, 10)
      let value = await orderValueTotal(app, user.id_service)
      console.log(value)
      client.sendText(number, `Ok, anotei seu endereço, seu pedido ficou em ${value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}, como você deseja pagar?\n1- No dinheiro\n2- No cartão?\n3- Com PIX?`);

    } else if (resp.sucess && resp.item.code === 2) {
      //corrigir endereço
      await setStage(app, number, 8)
      client.sendText(number, `Certo, agora me envie em uma unica frase o endereço completo.\nExemplo:Exemplo: Rua 7 setembro, número 8.`);

    } else {
      await setStage(app, number, 8)
      client.sendText(number, `Não entendi! me envie em uma unica frase o endereço completo.\nExemplo:Exemplo: Rua 7 setembro, número 8.`);;
    }
  }
  if (stage === 10) {
    //pagamento
    let compareArray = [
      { code: 1, keywords: "dinheiro" },
      { code: 2, keywords: "cartão" },
      { code: 3, keywords: "pix" }
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && resp.item.code === 1) {
      //din
      await setStage(app, number, 11)
      // await closeOrder(app, user.id_service)
      client.sendText(number, `Ok, você precisa de troco para quanto? Envie *não* ou o valor para o troco:`);

    } else if (resp.sucess && resp.item.code === 2) {
      //cart
      await setStage(app, number, 100)
      await paymentCredit(app, true, user.id_service)
      await closeOrder(app, user.id_service)
      client.sendText(number, `Ok, assim que estiver pronto enviaremos seu pedido, vamos te informar quando estiver saindo daqui. Qualquer coisa pode me chamar!`)
    } else if (resp.sucess && resp.item.code === 3) {
      //pix
      await setStage(app, number, 100)
      await paymentPix(app, true, user.id_service)
      await closeOrder(app, user.id_service)
      client.sendText(number, `A nossa chave PIX é:\n35998772439\n\nEfetue o pagamente e nos envie o comprovante para preparamos seu pedido!!`)

    
    } else {
      client.sendText(number, `Não entendi! Como você deseja pagar?\n1 - No dinheiro\n2 - No cartão?\n3- Com PIX?`);;
    }
  }
  // ok
  if (stage === 11) {
    //troco
    let compareArray = [
      { code: 1, keywords: "não" },
    ]
    let resp = await verifyString(message.body, compareArray)
    if (resp.sucess && resp.item.code === 1) {
      await setStage(app, number, 100)
      await closeOrder(app, user.id_service)
      client.sendText(number, `Ok, assim que estiver pronto enviaremos seu pedido, vamos te informar quando estiver saindo daqui. Qualquer coisa pode me chamar!`);  
    }else{
      await setStage(app, number, 100)
      await closeOrder(app, user.id_service)
      await paymentChange(app, parseFloat(message.body), user.id_service)
      client.sendText(number, `Ok, assim que estiver pronto enviaremos seu pedido, vamos te informar quando estiver saindo daqui. Qualquer coisa pode me chamar!`);

    }
  }
  if (stage === 100) {
    //mesmo endereço ou novo
    await setStage(app, number, 101)
    let dataOrder = await orderFormated(app, user.id_service)
    let address = `\n🏘️ *Endereço:* ${user.address}`
    client.sendText(number, `Olá, seu pedido está sendo preparado e vamos te avisar assim que tivermos novidades.\n\n✅ Segue o resumo do seu pedido:\n\n${dataOrder}${ user.id_address_service ? address : ''}\n💲 *Pagamento:* ${user.payment_card ? "💳 Cartão de Cŕedito" : user.payment_pix ? "PIX" : "💵 Dinheiro"}\n🗒️ *Status do pedido:* ${ user.sending ? "🛵 Saiu para a entrega" : user.producing ? "👨‍🍳 Em produção" : user.recived ? "🍳 Recebido na cozinha" : "📦 Seu pedido será atendido em breve!" }`)
  }

  return 0
}




export async function log(app, number, message, client) {
  console.log('\n\napp:', app.db, '\n\nde: ', number, "\n\nmesg: ", message, "\n\nclient: ", client)

}
