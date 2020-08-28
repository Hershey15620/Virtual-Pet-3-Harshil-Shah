//Create variables here
var Dog;
var happyDog;
var sadDog
var database;
var foodS;
var foodStock;

var feedpet;
var addFood;
var fedTime;
var lastFed;
var foodObj;

var gameState=0;
var changeState;
var readState;

var bedroom, garden, washroom;

function preload()
{
  //load images here
  sadDog= loadImage("Img/Dog.png");
  happyDog=loadImage("Img/happydog.png");
  bedroom= loadImage("Img/Bed Room.png");
  garden= loadImage("Img/Garden.png");
  washroom= loadImage("Img/Wash Room.png");
  
}

function setup() {
  database=firebase.database ()
  
  createCanvas(500, 500);
  foodObj= new Food();

  foodStock= database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState= database.ref("gameState");
  readState.on("value", function(data){
    gameState=data.val();
  });
  
  dog= createSprite(250,330,10,10);
  dog.addImage(sadDog);
  dog.scale=0.2;

  feedpet=createButton("Feed the Dog");
  feedpet.position(500,95);
  feedpet.mousePressed(feedDog)

  addFood= createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);


  

  

}


function draw() {  
  currentTime=hour();
  if (currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else {
    update("Hungry");
    foodObj.display();
  }

 if (gameState!=="Hungry"){
    feedpet.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feedpet.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  
  drawSprites();
}
//function to read FoodStock
function readStock(data){
  foodS= data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update foodStock and the last Fed time
function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour (),
    gameState:"Hungry"
  })
}



//function to update Food in Stock
function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}


function update(state){
  database.ref("/").update({
    gameState:state
  });
}


