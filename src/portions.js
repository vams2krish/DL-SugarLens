import {foods,servingSugar} from './foods.js';
export function portionSummary(items){
 const rows=items.flatMap(item=>{const food=foods.find(f=>f.fdc===item.fdc);const sugar=food&&servingSugar(food.sugar,item.grams);return sugar===null||sugar===undefined?[]:[{...item,name:food.name,sugar}];});
 const grams=rows.reduce((sum,item)=>sum+item.grams,0),sugar=rows.reduce((sum,item)=>sum+item.sugar,0);
 return {rows,grams,sugar,percentage:grams?sugar/grams*100:0};
}
export function csvReport(items){
 const {rows,grams,sugar,percentage}=portionSummary(items);
 return ['Food,Edible weight (g),Reference sugar (g),USDA FDC ID',...rows.map(row=>`${row.name},${row.grams},${row.sugar.toFixed(2)},${row.fdc}`),`TOTAL,${grams},${sugar.toFixed(2)},`,`Weighted sugar percentage,${percentage.toFixed(2)}%,,`].join('\r\n');
}
