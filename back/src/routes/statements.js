const db = require('../../config/db');
import { existsOrError, notExistsOrError, equalsOrError } from '../validation'

export async function getStatements(req, res){
    try{
        let stataments = await db.raw(`
        SELECT 
            u.name, u.phone,
            s.id_service, s.created_at, s.stage_service, s.id_address_service, s.finished, s.closed, s.recived, s.producing, s.sending, s.updated_at as service_updated_at, s.payment_card, s.payment_pix, s.change,
            TO_CHAR(s.updated_at, 'DD/MM/YYYY HH:MM:SS') as time_br,
            a.address, 
            (select  
                (SELECT COALESCE((SELECT SUM(p.price)       
                FROM service_products AS sp
                LEFT JOIN product AS p ON p.id_product = sp.id_product 
                WHERE sp.status = true
                and sp.id_service  = s.id_service),0))
            + (SELECT COALESCE((SELECT sum(price)            
                FROM service_additional sa 
                left JOIN additional a2 ON a2.id_additional = sa.id_additional
                WHERE sa.id_service = s.id_service), 0))
            as total)
        FROM "user" AS u
        LEFT JOIN "service" AS s ON s.id_user_service = u.id_user            
        LEFT JOIN "address" AS a ON a.id_user_address = u.id_user
        AND a.created_at = 
        (
            SELECT MAX(created_at)
            FROM address as a2
            WHERE a2.id_user_address = u.id_user
        )
        WHERE s.closed = true
        AND s.finished = false
        order by s.updated_at
        `)
        stataments = stataments.rows
        // console.log(stataments)
        let products
        let additionals
        for (let index = 0; index < stataments.length; index++) {
            products = await db.raw(
                `SELECT *            
                FROM service_products AS sp
                LEFT JOIN product AS p ON p.id_product = sp.id_product 
                WHERE sp.status = true
                and sp.id_service = '${stataments[index].id_service}'
                order by p.price desc`
                )
            products = products.rows
            
            stataments[index].products = products 
          
            additionals = await db.raw(
                `SELECT *        
                FROM service_additional sa 
                LEFT JOIN additional a2 ON a2.id_additional = sa.id_additional
                WHERE sa.id_service = '${stataments[index].id_service}'`
            )
            additionals = additionals.rows
            // stataments[index].additionals = additionals

            for (let jindex = 0; jindex < stataments[index].products.length; jindex++) {
                stataments[index].products[jindex].additionals = [];
            }
            for (let jindex = 0; jindex < stataments[index].products.length; jindex++) {

                    for (let kindex = 0; kindex < additionals.length; kindex++) {

                        if(stataments[index].products[jindex].id_sp === additionals[kindex].id_sp ){

                            stataments[index].products[jindex].additionals.push(additionals[kindex])
                        }
                }
            } 


            }      

        console.log(stataments.length)
        res.json(stataments)
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }

}
export async function lastServiceCreatedAt() {
    const createdAt = await db.raw(`SELECT 
                                created_at 
                            FROM service
                            WHERE created_at = 
                                (SELECT MAX(created_at)
                                FROM service as a2
                                WHERE closed = true
                                AND finished = false)
                            AND closed = true
                            AND finished = false`)
    return createdAt
}
export async function setStatamentStatus (req, res) {
    let data = req.body
    let field = data.field
    let type = data.type
    let phone = data.phone
    const id = req.params.id 
    try {
        existsOrError(field, 'sem field')
        existsOrError(id, 'sem id')
        let resp = await db('service')
            .update(field)
            .where({ id_service: id })
        console.log(resp)

        if(type){
            type = type === "sending" ? 'Seu pedido já foi enviado e esta a caminho do seu endereço!' : type === "producing" ? "Seu pedido já esta sendo preparado em nossa cozinha!": ''
            console.log(type)
            await db('msg')
                .insert({msg: type, phone})
        }

        res.status(204).send()
        
    } catch (msg) {
        console.log(msg)
        return res.status(400).send(msg)
    }
}
   
