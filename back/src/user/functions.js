import { existsOrError, notExistsOrError, equalsOrError } from '../validation'
import moment from 'moment'

export async function saveNewUser(app, user) {
    const data = user
    console.log(data.phone)
    try {
        existsOrError(data.name, 'Login não informado')
        existsOrError(data.phone, 'E-mail não informado')


        const phone = await app.db('user')
            .where({ phone: data.phone }).first()

        notExistsOrError(phone, 'Email já cadastrado para um usuário')

    } catch (msg) {
        return { message: msg, sucess: false };
    }

    try {
        const save = await app.db('user')
            .insert(data)
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true };
    } catch (err) {
        return err
    }

}

export async function saveService(app, id) {
        try {
            existsOrError(id, 'id')
            const save = await app.db('service')
                .insert({id_user_service : id})
            .returning('*')          

            console.log(save)
            return { message: "Salvo com sucesso!", sucess: true, data: save };
        } catch (err) {
            return err
        }    
}
//product
export async function saveProduct(app, id_service, id_product, status) {
    try {
        status = status ? true : false
        existsOrError(id_service, 'sem id_service')
        existsOrError(id_product, 'sem id_product')
        const save = await app.db('service_products')
            .insert({id_service, id_product, status})
        .returning('*')          

        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save };
    } catch (err) {
        return err
    }    
}

export async function activeLastProduct(app, id_service) {//reseta a hora/stage
    try {
        existsOrError(id_service, 'Erro ao receber id_service')
        
        const save = await app.db('service_products')
        .update({
            status: true,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'
             AND created_at = 
            (
                SELECT MAX(created_at)
                FROM "service_products"
                WHERE id_service = '${id_service}'
            )`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}
//address
export async function saveAddress(app, id_user_address, address) {
    try {
        existsOrError(id_user_address, 'sem id_user_address')
        existsOrError(address, 'sem address')
        const save = await app.db('address')
            .insert({id_user_address, address})
        .returning('*')          

        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save };
    } catch (err) {

        return err
    }    
}
export async function activeLastAddress(app, id_user) {
    try {
        existsOrError(id_user, 'Erro ao receber id_user')
        
        const save = await app.db('address')
        .update({
            status: true,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_user_address = '${id_user}'
             AND created_at = 
            (
                SELECT MAX(created_at)
                FROM "address"
                WHERE id_user_address = '${id_user}'
            )`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}
//
export async function existUser(app, number) {
    try {
        existsOrError(number, 'Erro ao receber seu número de celular')

        let dataUser = await app.db.raw(`
            SELECT 
                u.id_user as id_user, u.name, u.cpf, u.phone, u.status, u.stage, u.updated_at,
                s.id_service, s.id_address_service, s.stage_service, s.finished, s.closed, s.recived, s.created_at, s.producing, s.sending, s.updated_at as service_updated_at, s.payment_card,
                a.id_address, a.address
            FROM "user" AS u
            LEFT JOIN "service" AS s ON s.id_user_service = u.id_user
            AND s.finished = false
            AND s.created_at = 
            (
                SELECT MAX(created_at)
                FROM "service" as Z
                WHERE z.id_user_service = u.id_user
            )
            LEFT JOIN "address" AS a ON a.id_user_address = u.id_user
            AND a.created_at = 
            (
                SELECT MAX(created_at)
                FROM address as a2
                WHERE a2.id_user_address = u.id_user
            )
            WHERE u.phone = '${number}'  
            `)
            dataUser = dataUser.rows
            console.log('data:', dataUser)
        existsOrError(dataUser, 'Não encontramos seu cadastro!')

        if (moment().diff(dataUser.date_stage, 'hours') > 10) {
            let newStage
            if (dataUser.stage>3) {//name existe?
                newStage = 3 //stage cadastrado
            } else {
                newStage = 0// stage cadastra nome
            }
            //se a data do atendimento for maior q 24h(1 dia)
            //reseta o estagio, e a hora.          
            dataUser = await app.db('user')
                .update({
                    stage: newStage,
                    date_stage: app.db.fn.now()
                }).where({ phone: number }).returning('*')
        }

        return { message: "Encontramos seu cadastro!", sucess: true, data: dataUser };
    } catch (msg) {
        return { message: msg, sucess: false };
    }

}
export async function updateUser(app, number, update) {  

}
export async function resetUser(app, number) {//reseta a hora/stage
    try {
        existsOrError(number, 'Erro ao receber seu número de celular')
        let dataUser = await app.db.raw(`
            SELECT * 
            FROM "user" AS u
            WHERE u.number = ${number}  
            LEFT JOIN "service" AS s ON s.id_user_service = u.id_user
            AND s.created_at = 
            (
                SELECT MAX(created_at)
                FROM "service" as Z
                WHERE z.id_user_service = u.id_user
            )
        `)
        dataUser = dataUser.rows
    
            
        existsOrError(dataUser, 'Não encontramos seu cadastro!')
        if (moment().diff(dataUser.date_stage, 'days') > 0) {
            let newStage
            if (dataUser.name) {//name existe?
                newStage = 3 //stage cadastrado
            } else {
                newStage = 0// stage cadastra nome
            }
            //se a data do atendimento for maior q 24h(1 dia)
            //reseta o estagio, e a hora.          
            dataUser = await app.db('user')
                .update({
                    stage: newStage,
                    date_stage: app.db.fn.now(),
                    updated_at: app.db.fn.now()
                }).where({ phone: number }).returning('*')
        }

        return { message: "cadastro resetado", sucess: true, data: dataUser };
    } catch (msg) {
        return { message: msg, sucess: false };
    }

}

export async function saveNumber(app, number) {//reseta a hora/stage
    try {
        existsOrError(number, 'Erro ao receber seu número de celular')
        let dataUser = await app.db('user')
            .where({ phone: number }).first()
        notExistsOrError(dataUser, 'ja cadastrado!')        

        let save = await app.db('user')
            .insert({phone: number})
            .returning('*')          
        
        return { message: "Salvo com sucesso!", sucess: true, data: save };
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}

export async function updateName(app, number, name) {//reseta a hora/stage
    try {
        existsOrError(number, 'Erro ao receber seu número de celular')
        existsOrError(name, 'Erro ao receber seu nome')            
        const save = await app.db('user')
        .update({
            name,
            updated_at: app.db.fn.now()
        }).where({ phone: number }).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true };
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}
export async function changeStage(app, number, stage) {//reseta a hora/stage
    try {
        existsOrError(number, 'erro ao receber seu número de celular')
        existsOrError(stage, 'erro ao receber seu stage')            
        const save = await app.db('user')
        .update({
            stage,
            updated_at: app.db.fn.now()
        }).where({ phone: number }).returning('*')
        // console.log(save)
        return { message: "Salvo com sucesso!", sucess: true };
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}


export async function changeAux(app, number, aux) {
    aux = JSON.stringify(aux)
    try {
        existsOrError(number, 'erro ao receber seu número de celular')
        existsOrError(aux, 'erro ao receber seu aux')            
        const save = await app.db('user')
        .update({
            stage: app.db.raw('stage + 1'),
            aux: app.db.raw(`jsonb_set(??, '{lat}', ?)`, ['aux', aux]),
            updated_at: app.db.fn.now()
        }).where({ phone: number }).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true };
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}

// export async function resetUser(app, number) {//reseta a hora/stage
//     try {
//         existsOrError(number, 'Erro ao receber seu número de celular')
//         let dataUser = await app.db.raw(`
//             SELECT * 
//             FROM "user" AS u
//             WHERE u.number = ${number}  
//             LEFT JOIN "service" AS s ON s.id_user_service = u.id_user
//             AND s.created_at = 
//             (
//                 SELECT MAX(created_at)
//                 FROM "service" as Z
//                 WHERE z.id_user_service = u.id_user
//             )
//         `)
//         dataUser = dataUser.rows
    
            
//         existsOrError(dataUser, 'Não encontramos seu cadastro!')
//         if (moment().diff(dataUser.date_stage, 'days') > 0) {
//             let newStage
//             if (dataUser.name) {//name existe?
//                 newStage = 3 //stage cadastrado
//             } else {
//                 newStage = 0// stage cadastra nome
//             }
//             //se a data do atendimento for maior q 24h(1 dia)
//             //reseta o estagio, e a hora.          
//             dataUser = await app.db('user')
//                 .update({
//                     stage: newStage,
//                     date_stage: app.db.fn.now(),
//                     updated_at: app.db.fn.now()
//                 }).where({ phone: number }).returning('*')
//         }

//         return { message: "cadastro resetado", sucess: true, data: dataUser };
//     } catch (msg) {
//         return { message: msg, sucess: false };
//     }

// }