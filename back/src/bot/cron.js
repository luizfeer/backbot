import { emitFrontGlobal, sendMsgBot } from '../../index'
//emissores de dados

import { lastServiceCreatedAt } from '../routes/statements'
import { getMsg, setSendMsg } from '../msg/functions'
//buscas no bd
export async function loopBot() {
    try {
        console.log('loop')
        const data = await lastServiceCreatedAt()
        console.log(data.rows)
        emitFrontGlobal('lastUpdate', ...data.rows)
    } catch (error) {
        console.log(error)
    }

    try {
        let msgArray = await getMsg()
        console.log(msgArray)
        if(msgArray.sucess && msgArray.data.length>0){
            msgArray = msgArray.data
            for (let i = 0; i < msgArray.length; i++) {
                const msg = msgArray[i];
                console.log(msg.phone, msg.msg)
                const env = await sendMsgBot('session1', msg.phone, msg.msg)
                if(!env.error){
                    await setSendMsg(msg.id_msg)
                }
            }
            console.log('sucesso')

        }


    } catch (error) {
        console.log('erro', error)

    }
}