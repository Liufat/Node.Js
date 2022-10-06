class Person{
    constructor(name='noname', age = 0){
        this.name = name;
        this.age = age;
    }
    toJson(){
        const {name,age} = this;
        return {name, age, gender:"male"};
    }
    toString(){
        return JSON.stringify(this);
    }
    //覆蓋掉原本的toString的function
}
const p1 = new Person('David', 20);
console.log(p1 + '');
//使用JSON + ''來呼叫toString的function