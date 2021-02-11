const db = require('../../config/db');

export async function getProducts(req, res){
    try{
        let products = await db('product')
        .select('id_product', 'code', 'name', 'keywords', 'price', 'updated_at')
        Object.keys(products).map(function(key, index) {            
            products[key].price = products[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})           
          });
       
        console.log(products)
        res.json(products)
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }

}

// const save = async(req, res) => {
//     const user = {...req.body }
//         //  const { id, username, password } = user
//         //passa para variaveis os dados que vieram do bodyparse user

//     //const user = { login, idPessoa, password, confirmPassword, email, status, dataInclusao, dataAlteracao }
//     //cria o objeto pessoa com as variaveis separadas anteriormente

//     if (await req.params.id) user.idUsuario = await req.params.id
//         //define id se tiver
//     console.log(await req.params.id)
//     if (!user.idPessoa || (user.idPessoa && user.password) || (user.idPessoa && user.confirmPassword)) { //se nao tiver id (novo user), ou se tiver mas vir um campo com senha
//         //faz as ferificações de sernha
//         try {

//             existsOrError(user.password, 'Senha não informada')
//             existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
//             equalsOrError(user.password, user.confirmPassword,
//                 'Senhas não conferem')
//             user.password = encryptPassword(user.password)
//                 //encripita o pass
//             delete user.confirmPassword
//                 //deleta a confirmação pois so usa a original
//         } catch (msg) {
//             return res.status(400).send(msg)
//         }
//     }
//     // if (!req.originalUrl.startsWith('/users')) user.admin = false
//     // if (!req.user || !req.user.admin) user.admin = false

//     try {
//         existsOrError(user.login, 'Login não informado')
//         existsOrError(user.email, 'E-mail não informado')


//         const userEmailFromDB = await app.db('usuarios')
//             .where({ email: user.email }).first()

//         const userLoginFromDB = await app.db('usuarios')
//             .where({ login: user.login }).first()

//         if (!user.idUsuario) {
//             notExistsOrError(userEmailFromDB, 'Email já cadastrado para um usuário')
//             notExistsOrError(userLoginFromDB, 'Login já cadastrado para um usuário')
//         }
//     } catch (msg) {
//         return res.status(400).send(msg)
//     }


//     //deleta a confirmação pois so usa a original
//     if (user.idUsuario) {

//         //se tiver um id setado faz um update no id
//         try {
//             await app.db('usuarios')
//                 .update(user)
//                 .where({ idUsuario: user.idUsuario })
//             res.status(204).send()

//         } catch (err) {
//             res.status(500).send(err)
//         }
//     } else {

//         //se nao insere um novo
//         try {

//             await app.db('usuarios')
//                 .insert(user)

//             res.status(204).send()
//         } catch (err) {
//             res.status(500).send(err)
//         }
//     }
// }


