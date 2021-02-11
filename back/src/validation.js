
    export function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }//compara se esta vazio
    //se e string e ta vazio


    export function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }
    //chama a que verifica e se tem erro, retorna a mensagem

    export function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }
    //confere se valores a e b sao diferentes


    //retorna as funções
