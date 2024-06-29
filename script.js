var ctx = myCanvas.getContext('2d');
var FPS = 40;
var jump_amount = -10;
var max_fall_speed = +10;
var acceleration = 1;
var pipe_speed = -2;
var game_mode = 'prestart';
var time_game_last_running;
var bottom_bar_offset = 0;
var pipes = [];
var power_ups = [];
var number_mission = 2

var score = 0;
var seconds =0
var minutes=0
var ingame = false
const cidades = [
  "São Leopoldo",
  "Novo Hamburgo",
  "Estância Velha",
  "Ivoti",
  "Dois Irmãos",
  "Morro Reuter",
  "Santa Maria do Herval",
  "Presidente Lucena",
  "Linha Nova",
  "Picada Café",
  "Nova Petrópolis",
  "Gramado",
  "Canela",
  "São Francisco de Paula"
];
var cidadeAtual = 0
var cidadePrevisoria
function MySprite(img_url) {
  this.x = 0;
  this.y = 0;
  this.visible = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url || '';
  this.angle = 0;
  this.flipV = false;
  this.flipH = false;
}
MySprite.prototype.Do_Frame_Things = function () {
  ctx.save();
  ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
  ctx.rotate((this.angle * Math.PI) / 180);
  if (this.flipV) ctx.scale(1, -1);
  if (this.flipH) ctx.scale(-1, 1);
  if (this.visible)
    ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
  this.x = this.x + this.velocity_x;
  this.y = this.y + this.velocity_y;
  ctx.restore();
};
function ImagesTouching(thing1, thing2) {
  if (!thing1.visible || !thing2.visible) return false;
  if (
    thing1.x >= thing2.x + thing2.MyImg.width ||
    thing1.x + thing1.MyImg.width <= thing2.x
  )
    return false;
  if (
    thing1.y >= thing2.y + thing2.MyImg.height ||
    thing1.y + thing1.MyImg.height <= thing2.y
  )
    return false;
  return true;
}
function Got_Player_Input(MyEvent) {
   var audio = document.getElementById('myAudio');
  audio.play().then(function() {
      console.log('Áudio iniciado com sucesso');
  }).catch(function(error) {
      console.log('Falha ao iniciar o áudio:', error);
  });
  
  switch (game_mode) {
    case 'prestart': {
      game_mode = 'running';
      break;
    }
    case 'running': {
      bird.velocity_y = jump_amount;
      break;
    }
    case 'over':
      if (new Date() - time_game_last_running > 1000) {
        reset_game();
        game_mode = 'running';
        break;
      }
  }
  MyEvent.preventDefault();
}
addEventListener('touchstart', Got_Player_Input);
addEventListener('mousedown', Got_Player_Input);
addEventListener('keydown', Got_Player_Input);
function make_bird_slow_and_fall() {
  if (bird.velocity_y < max_fall_speed) {
    bird.velocity_y = bird.velocity_y + acceleration;
  }
  if (bird.y > myCanvas.height - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = 'over';
  }
  if (bird.y < 0 - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = 'over';
  }
}

function add_pipe(x_pos, top_of_gap, gap_width) {
  var top_pipe = new MySprite();
  top_pipe.MyImg = pipe_piece;
  top_pipe.x = x_pos;
  top_pipe.y = top_of_gap - pipe_piece.height;
  top_pipe.velocity_x = pipe_speed;
  pipes.push(top_pipe);
  var bottom_pipe = new MySprite();
  bottom_pipe.MyImg = pipe_piece;
  bottom_pipe.flipV = true;
  bottom_pipe.x = x_pos;
  bottom_pipe.y = top_of_gap + gap_width;
  bottom_pipe.velocity_x = pipe_speed;
  pipes.push(bottom_pipe);
}
function make_bird_tilt_appropriately() {
  if (bird.velocity_y < 0) {
    bird.angle = -15;
  } else if (bird.angle < 70) {
    bird.angle = bird.angle + 4;
  }
}
function show_the_pipes() {
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].Do_Frame_Things();
  }
}

function show_the_power_ups() {
  for (var i = 0; i < power_ups.length; i++) {
    power_ups[i].Do_Frame_Things();
  }
}

function check_for_end_game() {
  for (var i = 0; i < pipes.length; i++)
    if (ImagesTouching(bird, pipes[i])) game_mode = 'over';
}
function display_intro_instructions() {
  

  ctx.font = '16px Open Sans';
  
  ctx.textAlign = 'center';
  // Voando nas Rotas Românticas
  

  let imgLogo = new Image()
  imgLogo.src = './assets/FlappyLogo.png'
  
  ctx.drawImage(imgLogo, 12.5, 45, 300, 120);

  ctx.fillText('Clique na tela para iniciar', myCanvas.width / 2, 350);
   
}

function display_game_over() {
  const modalWidth = 260;
  const modalHeight = 175;
  const modalX = (myCanvas.width - modalWidth) / 2;
  const modalY = (myCanvas.height - modalHeight) / 2;

  // Desenhar o fundo preto semitransparente que preenche a tela
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // Desenhar o fundo do modal com bordas arredondadas
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(modalX + 30, modalY);
  ctx.lineTo(modalX + modalWidth - 30, modalY);
  ctx.quadraticCurveTo(modalX + modalWidth, modalY, modalX + modalWidth, modalY + 30);
  ctx.lineTo(modalX + modalWidth, modalY + modalHeight - 30);
  ctx.quadraticCurveTo(modalX + modalWidth, modalY + modalHeight, modalX + modalWidth - 30, modalY + modalHeight);
  ctx.lineTo(modalX + 30, modalY + modalHeight);
  ctx.quadraticCurveTo(modalX, modalY + modalHeight, modalX, modalY + modalHeight - 30);
  ctx.lineTo(modalX, modalY + 30);
  ctx.quadraticCurveTo(modalX, modalY, modalX + 30, modalY);
  ctx.closePath();
  ctx.fill();

  // Definir a fonte e cor do texto
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';

  // Desenhar os textos
  ctx.font = '25px Open Sans';
  ctx.fillText('Suas Informações:', modalX + modalWidth / 2, modalY + 35);
  ctx.font = '15px Open Sans';
  ctx.fillText('Cidade: ' + cidades[cidadeAtual], modalX + modalWidth / 2, modalY + 70);
  ctx.fillText('Frutas Coletadas: ' + score, modalX + modalWidth / 2, modalY + 100);
  ctx.fillText('Tempo Total: ' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds, modalX + modalWidth / 2, modalY + 130);

  // Desenhar o texto fora do modal
  ctx.font = '20px Open Sans';
  ctx.fillText('Clique na tela para reiniciar', myCanvas.width / 2, modalY + modalHeight + 40);
}

function display_bar_running_along_bottom() {
  if (bottom_bar_offset < -23) bottom_bar_offset = 0;
  ctx.drawImage(
    bottom_bar,
    bottom_bar_offset,
    myCanvas.height - bottom_bar.height
  );
}



function display_bar_running_along_bottom() {
  if (bottom_bar_offset < -23) bottom_bar_offset = 0;
  ctx.drawImage(
    bottom_bar,
    bottom_bar_offset,
    myCanvas.height - bottom_bar.height
  );
}


function reset_game() {
  bird.y = myCanvas.height / 2;
  bird.angle = 0;
  pipes = []; // erase all the pipes from the array
  power_ups = []; // erase all the power-ups from the array
  add_all_my_pipes(); // and load them back in their starting positions
  add_all_power_up()
  score = 0; // reset score
  number_mission = 0;
  minutes = 0; // reset minutes
  seconds = 0; // reset seconds
  number_mission = 2
  cidadeAtual = 0
}

function add_all_my_pipes() {
  add_pipe(500, 100, 140);
  add_pipe(800, 50, 140);
  add_pipe(1000, 250, 140);
  add_pipe(1200, 150, 120);
  add_pipe(1600, 100, 120);
  add_pipe(1800, 150, 120);
  add_pipe(2000, 200, 120);
  add_pipe(2200, 250, 120);
  add_pipe(2400, 30, 100);
  add_pipe(2700, 300, 100);
  add_pipe(3000, 100, 80);
  add_pipe(3300, 250, 80);
  add_pipe(3600, 50, 60);
  var finish_line = new MySprite('http://s2js.com/img/etc/flappyend.png');
  finish_line.x = 3900;
  finish_line.velocity_x = pipe_speed;
  pipes.push(finish_line);
}


function add_power_up(x_pos, y_pos) {
  var power_up = new MySprite('./assets/FlappyGrape.png'); // Temporário: Use a imagem de pássaro como teste
  power_up.x = x_pos;
  power_up.y = y_pos;
  power_up.velocity_x = pipe_speed;
  power_ups.push(power_up);
}
function add_power_up_in_middle(x_pos, top_of_gap, gap_width) {

  var middle_y = top_of_gap + (gap_width / 2);
  
  add_power_up(x_pos, middle_y);
}
function add_all_power_up(){
  add_power_up_in_middle(484, 50, 140);
  add_power_up_in_middle(784, 10, 140);
  add_power_up_in_middle(984, 210, 140);
  add_power_up_in_middle(1184, 110, 120);
  add_power_up_in_middle(1584, 60, 120);
  add_power_up_in_middle(1784, 110, 120);
  add_power_up_in_middle(1984, 160, 120);
  add_power_up_in_middle(2184, 210, 120);
  add_power_up_in_middle(2384, -10, 100);
  add_power_up_in_middle(2684, 260, 100);
  add_power_up_in_middle(2984, 60, 80);
}


// Adicionando power-ups no meio de cada cano

function check_for_power_up() {
  for (var i = 0; i < power_ups.length; i++) {
    if (ImagesTouching(bird, power_ups[i])) {
      power_ups[i].visible = false; // Colete o power-up
      score += 1;
      
      if(score === number_mission){
        cidadeAtual+=1
        number_mission+=2
      }
    }
  }
}

function drawMenu() {
  const posY = 10;  

  ctx.fillStyle = '#76372e';
  ctx.fillRect(0, posY, 135, 80);

  ctx.strokeStyle = '#85473b';
  ctx.lineWidth = 4.5;

  ctx.beginPath();
  ctx.moveTo(10, posY - 10);
  ctx.lineTo(10, posY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(125, posY - 10);
  ctx.lineTo(125, posY);
  ctx.stroke();

  ctx.textAlign = 'left';

  let posXText = 12
  ctx.font = '15px Open Sans';
  
  ctx.fillStyle = 'white';

  var timeText = 'Tempo: ' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  ctx.fillText(timeText, posXText, posY + 25);

  ctx.fillText('Frutas: ' + score, posXText, posY + 45);
  ctx.fillText(cidades[cidadeAtual], posXText, posY + 65);
}

function increment_time() {
  if(ingame == true) {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
  }
  
}





var pipe_piece = new Image();
pipe_piece.onload = add_all_my_pipes;
pipe_piece.src = './assets/FlappyPipe.png'; 


function Do_a_Frame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  bird.Do_Frame_Things();
  display_bar_running_along_bottom();
  switch (game_mode) {
    case 'prestart': {
      display_intro_instructions();
      break;
    }
    case 'running': {
      time_game_last_running = new Date();
      bottom_bar_offset = bottom_bar_offset + pipe_speed;
      show_the_pipes();
      show_the_power_ups(); // Mostrar os power-ups
      make_bird_tilt_appropriately();
      make_bird_slow_and_fall();
      check_for_end_game();
      check_for_power_up();
      drawMenu()
      ingame = true
      break;
    }
    case 'over': {
      make_bird_slow_and_fall();
      display_game_over();
      ingame = false
      break;
    }
  }
}
var bottom_bar = new Image();
bottom_bar.src = './assets/flappybottom.png'; // Imagem de barra inferior tradicional
// /assets/images/FlappyBottom.jpeg

var bird = new MySprite('./assets/FlappyBird.png'); // Imagem de pássaro tradicional
// /assets/images/FlappyBird.png
// http://s2js.com/img/etc/flappybird.png
bird.x = myCanvas.width / 2.4;
bird.y = myCanvas.height / 2;

// Adiciona power-ups ao iniciar o jogo


add_all_power_up()

// Inicia o cronômetro
setInterval(increment_time, 1000);
setInterval(Do_a_Frame, 1000 / FPS);
