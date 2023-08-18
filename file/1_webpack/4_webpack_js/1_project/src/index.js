// import a from './a'
@d
class Animal{
  constructor(type){
    this.type = type
  }
  getType(){
    return this.type
  }
}
function d(){
  console.log('装饰器')
}
let animal = new Animal('哺乳类')
console.log('animal.type:', animal.getType())
let P = new Promise((resolve, reject) => {})