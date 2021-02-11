const db = require('../../config/db');

async function log(){

    async function getOrder(id_service) {
        try {
           
            let product = await db.raw(
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
let products = await getOrder(5)
  products = products.data.rows
  console.log(products)
  let msg = "🚨  Seu carrinho  \n\n"  
  let total = 0
  Object.keys(products).map(value => {
    total += products[value].price
    msg += `*${products[value].amount} - ${products[value].name} : *${(products[value].price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}*\n`
  });
  msg += `\n- Total: ${(total).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}\n`
  console.log(msg)
}
log();
async function savedata() { 

    let dale = await db("product")
    .insert({
        name: "Coca 2l",
        keywords: 'refrigerante coca coca-cola 2l',
        description_menu: 'uma Coca 2 litros',
        description: "2l",
        price: 14.90
    }).returning("id_product")
    let dale1 = await db("product")
    .insert({
        name: "Frango 1KG",
        keywords: "balde frango 1kg",
        description_menu: 'um Balde de frango 1KG',
        description: "Balde Frango 1KG",
        price: 10.90
    }).returning("id_product")
    let dale2 = await db("product")
    .insert({
        name: "8kg de carne",
        keywords: '8kg de carne',
        description_menu: 'uma carne 8kg',
        description: "900ml",
        price: 120.90
    }).returning("id_product")
    
    console.log(dale, dale1, dale2);
}
// savedata()

async function getData1 () {
    let dataUser = await db('user')
    .select('*')
    .where('user.id_user', 1)
    .leftJoin('service', function() {
        this.on('service.id_user_service', 'user.id_user')
            .andOn('service.created_at', '=', db.raw("(select min(created_at) from service where service.id_user_service = user.id_user)"))
    })
    .orderBy('updated_at', 'desc')
    .then(function(threads) {
        return threads;
    });

    console.log(dataUser);
}
async function getData () {
    let number = '553599976145@c.us'
    let dataUser = await db.raw(`
    SELECT * 
    FROM "user" AS u
    LEFT JOIN "service" AS s ON s.id_user_service = u.id_user
    AND s.created_at = 
    (
        SELECT MAX(created_at)
        FROM "service" as Z
        WHERE z.id_user_service = u.id_user
        )
    WHERE u.phone = '${number}'
    `)

    console.log(dataUser.rows);
}

// await db("usuarios")
//     .insert({
//         login: "test_login",
//         idPessoa: dale[0],
//         password: "123",
//         email: "email@.com",
//         status: true
//     })


