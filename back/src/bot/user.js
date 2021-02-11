
module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation
        //chama as funções de verificcação em app api validation


    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
            //saltos para o tempero da criptografia
        return bcrypt.hashSync(password, salt)
            //retorna criptografada
    }

    const save = async(req, res) => {
        const user = {...req.body }
            //  const { id, username, password } = user
            //passa para variaveis os dados que vieram do bodyparse user

        //const user = { login, idPessoa, password, confirmPassword, email, status, dataInclusao, dataAlteracao }
        //cria o objeto pessoa com as variaveis separadas anteriormente

        if (await req.params.id) user.idUsuario = await req.params.id
            //define id se tiver
        console.log(await req.params.id)
        if (!user.idPessoa || (user.idPessoa && user.password) || (user.idPessoa && user.confirmPassword)) { //se nao tiver id (novo user), ou se tiver mas vir um campo com senha
            //faz as ferificações de sernha
            try {

                existsOrError(user.password, 'Senha não informada')
                existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
                equalsOrError(user.password, user.confirmPassword,
                    'Senhas não conferem')
                user.password = encryptPassword(user.password)
                    //encripita o pass
                delete user.confirmPassword
                    //deleta a confirmação pois so usa a original
            } catch (msg) {
                return res.status(400).send(msg)
            }
        }
        // if (!req.originalUrl.startsWith('/users')) user.admin = false
        // if (!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.login, 'Login não informado')
            existsOrError(user.email, 'E-mail não informado')


            const userEmailFromDB = await app.db('usuarios')
                .where({ email: user.email }).first()

            const userLoginFromDB = await app.db('usuarios')
                .where({ login: user.login }).first()

            if (!user.idUsuario) {
                notExistsOrError(userEmailFromDB, 'Email já cadastrado para um usuário')
                notExistsOrError(userLoginFromDB, 'Login já cadastrado para um usuário')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }


        //deleta a confirmação pois so usa a original
        if (user.idUsuario) {

            //se tiver um id setado faz um update no id
            try {
                await app.db('usuarios')
                    .update(user)
                    .where({ idUsuario: user.idUsuario })
                res.status(204).send()

            } catch (err) {
                res.status(500).send(err)
            }
        } else {

            //se nao insere um novo
            try {

                await app.db('usuarios')
                    .insert(user)

                res.status(204).send()
            } catch (err) {
                res.status(500).send(err)
            }
        }
    }


    const get = (req, res) => {
        app.db('usuarios')
            .select('idUsuario', 'login', 'idPessoa', 'email', 'status', 'dataInclusao', 'dataAlteracao')
            // .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))

    }


    const getById = (req, res) => {
        app.db('usuarios')
            .select('idUsuario', 'login', 'idPessoa', 'email', 'status')
            .where({ idUsuario: req.params.id })
            //.whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }
    const getByIdPessoa = async(req, res) => {

        try {

            const userDB = await app.db('usuarios')
                .select('idUsuario', 'login', 'idPessoa', 'email', 'status')
                .where({ idPessoa: await req.params.id })
                //.whereNull('deletedAt')
                .first()
            if (userDB) {
                return res.status(200).send({ userDB, search: true })
            }
            return res.status(200).send({ search: false })
        } catch (err) {
            res.status(500).send(err)
        }

    }

    const remove = async(req, res) => {
        try {
            const articles = await app.db('articles')
                .where({ userId: req.params.id })
            notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('usuarios')
                .update({ deletedAt: new Date() })
                .where({ idUsuario: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            return res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return { save, get, getById, getByIdPessoa, remove }
}