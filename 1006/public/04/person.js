export default class Person{ //export default=>將物件匯出，有default的話，class名稱在inport時就不看了 **default只能設定一個
    constructor(name='noname', age = 0){
        this.name = name;
        this.age = age;
    }
    toJson(){
        const {name,age, gender} = this;
        return {name, age, gender};
    }
    toString(){
        return JSON.stringify(this);
    }
    //覆蓋掉原本的toString的function
}
export const p1 = new Person('David', 20);
// console.log(p1 + '');
const f = n => n*n;
export {f};
//使用JSON + ''來呼叫toString的function