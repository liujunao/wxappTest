/*
var volunteerList = new Array("1oUkCajhHYh4NOH25tXNq95WnhGMk", 
                              "2oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "3oUkCajhHYh4NOH25tXNq95WnhGMk",
		              "4oUkCajhHYh4NOH25tXNq95WnhGMk",
  			      "5oUkCajhHYh4NOH25tXNq95WnhGMk")
*/
var volunteerList = [ "1oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "2oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "3oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "4oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "5oUkCajhHYh4NOH25tXNq95WnhGMk" ] 
const num = 3
var length = volunteerList.length
var cnt = 0
async function getOpenId(num){
  var x =  await Math.ceil(Math.random()*num);
  var y = x-1
  console.log('x: '+ x )
  return x 
}

function exchange(id1, id2){
	var tmp = id1
	id1 = id2
	id2 = tmp
}

async function exec(volunteerList){
    await exchange(volunteoerList[1], volunteerList[0])
    console.log(volunteerList)
}

//var leftlist = getOpenId(volunteerList)
//var tmp = volunteerList[1]
//volunteerList[1] = volunteerList[0]
//volunteerList[0] = tmp
console.log(volunteerList)
async function exec1( num, cnt, volunteerList, length){
while(cnt < num){
  let m = await getOpenId(num-cnt) 
  cnt = cnt + 1
  let tmp = volunteerList[m-1]
  console.log('length'+ length)
  volunteerList[m-1] = volunteerList[length-cnt] 
  volunteerList[length-cnt] = tmp
  console.log(volunteerList)
}
}

async function exec2 ( num, cnt, volunteerList, length){
await exec1( num, cnt, volunteerList, length)
console.log(volunteerList.slice(length-3 ,length))
}
exec2( num, cnt, volunteerList, length)
console.log(volunteerList.slice(length-3 ,length))
/*
console.log(n)
var x =  Math.ceil(Math.random()*5);
console.log('x: '+ x )
console.log('slice(0,2): ' )
var y = x-1
console.log(volunteerList.slice(0,y))
console.log(volunteerList.slice(0,y).concat( volunteerList.slice(x,n)) )
*/
