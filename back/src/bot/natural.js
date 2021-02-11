const db = require('../../config/db');
const natural = require('natural');

async function getMenu(app) {
    try {

        let product = await app('product')
        .select('id_product', 'code', 'keywords', 'description_menu', 'price')
            
        // .where({ id_product: id })
        return { message: 'menu', sucess: true, data: product };
    } catch (msg) {
        return { message: msg, sucess: false };
    }
}
function verify(message, menuData){
    // console.log(menuData)
    let string  
    let item = menuData[0]
    let itemAux = 0
    for(var i=0; i<menuData.length; i++) {
        if(message.length<4){
             string = `${menuData[i].code}`
             //se for curto é o id do produto
        }else{
             string = `${menuData[i].keywords}`
             //se for maior usa o keyword
        }
       aux = natural.JaroWinklerDistance(string, message.toLowerCase())
       console.log(aux, string)
       if(aux > itemAux){
           item = menuData[i]
           itemAux = aux
       }
    }
    console.log(item)
    
    // let mapp = menuData.map(function(product){
    //     return {
    //             id: product.id_product,
    //             num: natural.JaroWinklerDistance(product.keywords, message.toLowerCase())
    //         }
        
    //     }
    // )
    // console.log(mapp)
    //   if(natural.JaroWinklerDistance(menuData[i], message.toLowerCase())){
    //     return true          
    //   }
    // } 
    // return false
}
async function menu() {
    
    try {
        let menuinfo = await getMenu(db)

        verify('55', menuinfo.data)

        // console.log(menu)

    } catch (e) {
        // console.log(e)
    }
    
}
menu()
// console.log(natural.PorterStemmerPt.stem("fontes"));
// console.log(natural.PorterStemmer.stem("words"));
// verify('coca 2l', menuData.data)
// let xfrango = "3 refrigerante coca-cola coca 2l"
// console.log("frase 1", natural.JaroWinklerDistance(xfrango, "3"));
// console.log("frase 2", natural.JaroWinklerDistance(xfrango, 'coca 2l'));


