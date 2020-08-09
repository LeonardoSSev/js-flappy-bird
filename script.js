console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './assets/imgs/sprites.png';

const audio_HIT = new Audio();
audio_HIT.src = './assets/sounds/hit.wav';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    atualiza() {
      if (fezColisao(flappyBird, chao)) {
        audio_HIT.play();

        mudaTela(telas.INICIO);
        return;
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
    pula() {
      flappyBird.velocidade = flappyBird.velocidade - flappyBird.pulo;
    }
  }

  return flappyBird;
}


const telaDeInicio = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      telaDeInicio.spriteX, telaDeInicio.spriteY, // Sprite X, Sprite Y
      telaDeInicio.largura, telaDeInicio.altura, // Tamanho do recorte na sprite
      telaDeInicio.x, telaDeInicio.y,
      telaDeInicio.largura, telaDeInicio.altura,
    );
  }
}

const globais = {};
let telaAtiva = {};

const telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
    },
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      telaDeInicio.desenha();
    },
    atualiza() {
      // TODO
    },
    click() {
      mudaTela(telas.JOGO);
    }
  },
  JOGO: {
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
    },
    atualiza() {
      globais.flappyBird.atualiza();
    },
    click() {
      globais.flappyBird.pula();
    }
  }
}

function fezColisao(flappyBird, chao) {
  if (flappyBird.y + flappyBird.altura >= chao.y) {
    return true;
  }

  return false;
}

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

function mudaTela(novaTela) {
  telaAtiva = novaTela;

  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

canvas.addEventListener('click', function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaTela(telas.INICIO);
loop();