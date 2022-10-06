const {Person,p1,f} = require('./person')//使用require這個function來匯入資料(如果匯入的副檔名是js、json，則副檔名可省略，但名稱重複時會優先抓.js的資料)
//Person = person.mjs裡default的那個變數
const p2 = new Person('Flora', 26);
console.log(p2.toString());
console.log(p1);
console.log(f(10));