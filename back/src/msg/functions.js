const db = require('../../config/db');

export async function getMsg() {
    try {
        const product = await db('msg')
            .where({ send: false })

        return { sucess: true, data: product };
    } catch (msg) {
        return { sucess: false };
    }
}
export async function setSendMsg(id) {
    try {
        const update = await db('msg')
            .update({ send: true })
            .where({ id_msg: id })

        console.log(update)

        return { sucess: true, data: update };

    } catch (error) {
        console.log(error)

        return { sucess: false };
    }
}
