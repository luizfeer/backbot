import { existsOrError, notExistsOrError, equalsOrError } from '../validation'
// import moment from 'moment'
// const db = require('../../../config/db')
export async function getMenu(app) {
    try {
       const product =  await app.db('product')
       .select('id_product', 'name', 'code', 'keywords', 'description_menu', 'price', 'additional', 'additional_type')
       .where({ show: true })
       .orderBy('code')
           
        // let product = await app.db('product')
        // .returning('*')
            // .where({ id_product: id })
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        return { message: msg, sucess: false };
    }
}
export async function getMenuAdditional(app, id_service) {//reseta a hora/stage
    try {
        existsOrError(id_service, 'Erro ao receber id_service')
        
        let last = await app.db.raw(`
            select a2.id_additional, a2.name, a2.keywords, a2.description_menu, a2.description , a2.price, a2.code,
            sp.id_product, sp.id_service, id_sp,
            p.description , p."name" as nameproduct 
            from service_products as sp
            LEFT JOIN "product" AS p ON p.id_product = sp.id_product
            LEFT JOIN additional a2 ON p.additional_type = a2.id_additional_type 
            where sp.id_service = '${id_service}' AND sp.created_at = 
            (
                SELECT MAX(created_at)
                FROM "service_products" as a
                WHERE a.id_service = '${id_service}'
            )`)
        
        last = last.rows

        return { message: "menu", sucess: true, data: last};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}

export async function saveAdditional(app, id_service, id_additional, id_sp) {
    try {
        existsOrError(id_service, 'sem id_service')
        existsOrError(id_additional, 'sem id_additional')
        existsOrError(id_sp, 'sem id_sp')
        const save = await app.db('service_additional')
            .insert({id_service, id_sp, id_additional})
        .returning('*')          

        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save };
    } catch (err) {
        return err
    }    
}
export async function getProduct(app, code) {
    try {
       
        let product = await app.db('product')
        .where({id_product: code})
        .returning('*')
        .first()
            // .where({ id_product: id })
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        console.log(msg)
        return { message: msg, sucess: false };
    }
}
export async function getOrder(app, id_service) {
    try {
       
        let product = await app.db.raw(
            `SELECT *            
            FROM service_products AS sp
            LEFT JOIN product AS p ON p.id_product = sp.id_product 
            WHERE sp.status = true
            and sp.id_service = '${id_service}'`
            )
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        console.log(msg)
        return { message: msg, sucess: false };
    }
}
export async function getOrderAdditional(app, id_service) {
    try {       
        let product = await app.db.raw(
            `SELECT *            
            FROM service_additional sa 
            LEFT JOIN additional a2 ON a2.id_additional = sa.id_additional
            WHERE sa.id_service = '${id_service}'`
            )
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        console.log(msg)
        return { message: msg, sucess: false };
    }
}

export async function getOrderValue(app, id_service) {
    try {
       
        let total = await app.db.raw(
            `select 
            (SELECT SUM(p.price)       
            FROM service_products AS sp
            LEFT JOIN product AS p ON p.id_product = sp.id_product 
            WHERE sp.status = true
            and sp.id_service  = '${id_service}') + (SELECT sum(price)            
            FROM service_additional sa 
            LEFT JOIN additional a2 ON a2.id_additional = sa.id_additional
            WHERE sa.id_service = '${id_service}') AS total
            `)
        return { message: 'total', sucess: true, data: total };
    } catch (msg) {
        console.log(msg)
        return { message: msg, sucess: false };
    }
}

//create service
export async function createService(app, user) {
    const data = user
    try {
        const phone = await app.db('user')
        .where({ phone: data.phone }).first()

        
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        console.log(msg)
        return { message: msg, sucess: false };
    }
}


export async function saveCloseOrder(app, id_service) {//reseta a hora/stage
    try {
        existsOrError(id_service, 'Erro ao receber id_service')
        
        const save = await app.db('service')
        .update({
            closed: true,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}

export async function activeAddressService(app, id_service, id_address) {//reseta a hora/stage
    try {
        existsOrError(id_service, 'Erro ao receber id_service')
        existsOrError(id_address, 'Erro ao receber id_address')
        console.log('ADRESS',id_service,id_address)
        
        const save = await app.db('service')
        .update({
            id_address_service: id_address,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'`
        ).returning('*')
        console.log('ADRESSACTIVE',save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}

//payment
export async function savePaymentCredit(app, boolean, id_service) {//reseta a hora/stage
    try {
        existsOrError(boolean, 'Erro ao receber boolean')
         
        const save = await app.db('service')
        .update({
            payment_card: boolean,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}
export async function savePaymentPix(app, boolean, id_service) {//reseta a hora/stage
    try {
        existsOrError(boolean, 'Erro ao receber boolean')
         
        const save = await app.db('service')
        .update({
            payment_pix: boolean,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}
export async function savePaymentChange(app, value, id_service) {//reseta a hora/stage
    try {
        existsOrError(value, 'Erro ao receber value')
         
        const save = await app.db('service')
        .update({
            change: value,
            updated_at: app.db.fn.now()
        }).whereRaw(
            `id_service = '${id_service}'`
        ).returning('*')
        console.log(save)
        return { message: "Salvo com sucesso!", sucess: true, data: save};
    } catch (msg) {
        return {message: msg, sucess: false}
    }
}


//teste
// async function getMenu1(app) {
//     try {
       
//         let product = await app('product')
//         .returning('*')
//             // .where({ id_product: id })
//         console.log(product)
//         return { message: 'menu', sucess: true, data: product };
//     } catch (msg) {
//         return { message: msg, sucess: false };
//     }

// }
// getMenu1(db)