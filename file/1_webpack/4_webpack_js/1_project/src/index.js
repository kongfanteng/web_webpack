// import a from './a'
function d() {
  console.log('装饰器')
}
@d
class Animal {
  constructor(type) {
    this.type = type
  }

  getType() {
    return this.type
  }
}

const animal = new Animal('哺乳类')
console.log('animal.type:', animal.getType())
