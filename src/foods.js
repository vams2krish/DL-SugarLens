// USDA SR Legacy raw edible portions. Total sugars, grams per 100 g.
export const foods = [
 ['Apple','🍎',10.4,'171688',['Granny Smith']],
 ['Banana','🍌',12.2,'173944',['banana']],
 ['Orange','🍊',9.35,'169097',['orange']],
 ['Strawberry','🍓',4.89,'167762',['strawberry']],
 ['Pineapple','🍍',9.85,'169124',['pineapple']],
 ['Lemon','🍋',2.5,'167746',['lemon']],
 ['Broccoli','🥦',1.7,'170379',['broccoli']],
 ['Cucumber','🥒',1.67,'168409',['cucumber']],
 ['Carrot','🥕',4.74,'170393',[]],
 ['Tomato','🍅',2.63,'170457',[]],
 ['Watermelon','🍉',6.2,'167765',[]],
 ['Grapes','🍇',15.5,'174683',[]],
 ['Avocado','🥑',0.66,'171705',[]],
 ['Cauliflower','🥬',1.91,'169986',['cauliflower']],
 ['Red bell pepper','🫑',4.2,'170108',['bell pepper']],
 ['Zucchini','🥒',2.5,'169291',['zucchini','courgette']],
 ['Cabbage','🥬',3.2,'169975',['head cabbage']],
 ['Mango','🥭',13.7,'169910',[]]
].map(([name,emoji,sugar,fdc,labels])=>({name,emoji,sugar,fdc,labels}));
export function candidates(predictions) {
 return foods.flatMap(food=>{const match=predictions.find(p=>food.labels.some(label=>p.className.toLowerCase().split(',').map(s=>s.trim()).includes(label.toLowerCase())));return match&&match.probability>=0.1?[{...food,probability:match.probability}]:[]}).sort((a,b)=>b.probability-a.probability);
}
export function servingSugar(sugar,grams) {if(!Number.isFinite(grams)||grams<=0||grams>5000) return null;return sugar*grams/100;}
