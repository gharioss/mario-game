import platform from "../img/platform.png";
import hills from "../img/hills.png";
import background from "../img/background.png";
import platformSmallTall from "../img/platformSmallTall.png";
//character
import spriteRunLeft from "../img/spriteRunLeft.png";
import spriteRunRight from "../img/spriteRunRight.png";
import spriteStandLeft from "../img/spriteStandLeft.png";
import spriteStandRight from "../img/spriteStandRight.png";

// we select the canvas tag put in our html
const canvas = document.querySelector("canvas");

// we stock in "c" the context of our page, which would be a 2d style
const c = canvas.getContext("2d");

// we define that the width and height of the canvas will take the whole page
canvas.width = 1024;
canvas.height = 576;
// canvas.width = 1024;
// canvas.height = 576;

//we define the gravity (the more time it falls, the faster it will fall)
const gravity = 1.5;

// we create a Player class which will take all the caracteristics of a player
class Player {
  //the constructor method will be loading everything we call the Play class, so its attribut are going to be the top priority
  constructor() {
    this.speed = 10;
    // we define the position of the Player, x and y (in math, for 2d)
    this.position = {
      x: 100,
      y: 100,
    };

    //this.velocity.y : 1 makes it go down (x = left and right, y = up and down)
    this.velocity = {
      x: 0,
      y: 1,
    };

    //we give to the Player the width and heigth it should have
    this.width = 66;
    this.height = 150;

    this.image = createImage(spriteStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  //we create a draw function which are going to draw our player
  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  //this update function is used to update the position of our player
  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    )
      this.frames = 0;
    else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    )
      this.frames = 0;
    //we fist draw the player
    this.draw();
    //we add it its velocity (to make it go down when restarting)
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    //this if is made so it won't go down all the time, it will stop once it's at the bottom of our canvas, we calculate if the height of our player is <= of the height of our canvas
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      //if it is, we add the gravity
      this.velocity.y += gravity;
    else {
      //else we stop its movement
      // this.velocity.y = 0;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y,
    };
    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}
let plateformImage = createImage(platform);
let plateformSmallTallImage = createImage(platformSmallTall);

//we call the class
let player = new Player();

//we make 2 plateforms
let plateforms = [];
let genericObject = [];

let lastKey;
//we make the keys false by default
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

//variable made to check if we win the game
let scrollOffset = 0;

function init() {
  plateformImage = createImage(platform);

  //we call the class
  player = new Player();

  //we make 2 plateforms
  plateforms = [
    new Platform({
      x:
        plateformImage.width * 4 +
        300 -
        2 +
        plateformImage.width -
        plateformSmallTallImage.width,
      y: 270,
      image: createImage(platformSmallTall),
    }),
    new Platform({ x: -1, y: 470, image: plateformImage }),
    new Platform({
      x: plateformImage.width - 3,
      y: 470,
      image: plateformImage,
    }),
    new Platform({
      x: plateformImage.width * 2 + 100,
      y: 470,
      image: plateformImage,
    }),
    new Platform({
      x: plateformImage.width * 3 + 300,
      y: 470,
      image: plateformImage,
    }),
    new Platform({
      x: plateformImage.width * 4 + 300 - 2,
      y: 470,
      image: plateformImage,
    }),
    new Platform({
      x: plateformImage.width * 5 + 650 - 2,
      y: 470,
      image: plateformImage,
    }),
  ];
  genericObject = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];
  scrollOffset = 0;
}

//this animate function is made so the player will keep being a square
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObject.forEach((genericObject) => {
    genericObject.draw();
  });

  //we make a loops on each plateform to make them all appear
  plateforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  //if keys.right.pressed = true then we add its velocity && for the scroll horizontal, if it's < 400px then we keep moving else we stop
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
    //same for left
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
    //else we stop its velocity, which makes it stops
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      //when the plateform moves to the left, we add 5
      scrollOffset += player.speed;
      //we make a loop so that it is applied to each platforms
      plateforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObject.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      //if the plateform moves to the right, we take back 5
      scrollOffset -= player.speed;
      plateforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObject.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
  }

  //platform collision detection
  plateforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  }

  //if finally the variable if > 2000 then we win the game
  if (scrollOffset > plateformImage.width * 5 + 300 - 2) {
    console.log("you win");
  }
  if (player.position.y > canvas.height) {
    init();
  }
}
init();
animate();

//if we press a key
window.addEventListener("keydown", ({ keyCode }) => {
  //with the keycode (z, q, s, d)
  switch (keyCode) {
    case 81:
      //if q is press, which is left, the key left is true
      //left
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case 83:
      //down
      break;
    case 68:
      //if d is press, which is right, the key left is true
      //right
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case 90:
      //up
      player.velocity.y -= 25;
      break;
  }
});

//this is made so that if we dont click anymore, the key where we clicked is now false
window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 81:
      //left
      keys.left.pressed = false;
      break;
    case 83:
      //down
      break;
    case 68:
      //right
      keys.right.pressed = false;
      break;
    case 90:
      //up
      break;
  }
});
