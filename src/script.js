let targetX, targetY; //declara as variaveis para a posição alvo.

function preload() {
  //carrega o fundo e o atlas do personagem. Usei o site leshylabs para fazer os sprites.
  this.load.image("background", "assets/sky.jpg");
  this.load.atlas("boneco", "assets/spritesheet.png", "assets/sprites.json");
}

function create() {
  this.add.image(390, 210, "background").setScale(1); 

  // Criando animações
  this.anims.create({
    key: "frente", //o arquivo json é dividido por palavras chaves que caracterizam as animações frente e tras
    frames: this.anims.generateFrameNames("boneco", {
      prefix: "frente",
      end: 6, //há 6 imagens na animação de frente
      zeroPad: 4, //há 4 zeros na primeira imagem
    }),
    repeat: -1, //repita a animação em looping.
  });

  this.anims.create({
    key: "tras",
    frames: this.anims.generateFrameNames("boneco", {
      prefix: "tras",
      end: 8, //há 8 images na animaçao tras o que deixou ela um pouco mais fluida 
      zeroPad: 4,
    }),
    repeat: -1,
  });

  // Criando o boneco com física
  this.boneco = this.physics.add.sprite(config.width / 2, config.height / 2, "boneco");
  this.boneco.setCollideWorldBounds(true).setScale(0.8);

  // Chamando a função random pra gerar um ponto para o boneco seguir
  setRandomTarget();
}

function update() {
  if (!this.boneco || !targetX || !targetY) return; // essa linha previne erros quando a função update() chama uma dessas váriaveis e elas não foram definidas. Antes de colocar essa linha, o movimento do boneco estava meio travadao.

  // Calcula a direção do movimento
  let dx = targetX - this.boneco.x;//calcula a diferença na posição x entre o boneco e o alvo
  let dy = targetY - this.boneco.y;//calcula a diferença na posição y entre o boneco e o alvo
  let distance = Math.sqrt(dx * dx + dy * dy); //calcula a distancia de fato entre o ponto e o boneco no plano cartesiano através de um pitagoras.
  const speed = 7; // Velocidade do movimento
  let contador = 0;//Contador para evitar que o while fique executando varios movimentos em um unico frame, deixando a movimentação mais fluida
  while (distance >= 100 && contador<1) {
    this.boneco.x += (dx / distance) * speed; //isso normaliza o valor adicionado à posição x do boneco, variando entre 1 e -1, aí ao multiplicar pela velocidade, aumenta o deslocamento do boneco por loop
    this.boneco.y += (dy / distance) * speed;
    
    // Recalcula a distância a partir da nova posição do boneco
    dx = targetX - this.boneco.x; 
    dy = targetY - this.boneco.y;
    distance = Math.sqrt(dx * dx + dy * dy);

    // Escolhe a animação com base no movimento pra esquerda o direita
    if (dx > 0) {
      this.boneco.anims.play("frente", true);
    } else {
      this.boneco.anims.play("tras", true);
    }
    contador++
  }
  
  // Se o boneco alcançar o destino, define um novo ponto aleatório
  if (distance < 100) {
    setRandomTarget();
  }
}

// Define um novo ponto aleatório como destino
function setRandomTarget() {
  //uso a função random() pra gerar valores aleatórios entre 0 e 1 para ser multiplicado pelo comprimento da tela
  targetX = Math.random() * config.width;
  targetY = Math.random() * config.height;
}

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 500,
  backgroundColor: "#f9f9f9",
 
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE, //Implementação de responsividade no jogo com scale.
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
},
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

