const playerSprite = sessionStorage.getItem('player_sprite') || "../Assets/Personagens_Usuario/menino_black.png";
const playerName = sessionStorage.getItem('player_name') || '—';

// Helper seguro para inteiros
function getInt(key, fallback = 0) {
  const raw = sessionStorage.getItem(key);
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? fallback : n;
}

const scenes = [
  {
    // Cena 0: Entrada do Instituto Federal
    background: "../Assets/Cenarios/Instituto_Federal_Frente.png",
    sprite: playerSprite,
    position: { left: '50%', bottom: '0px', transform: 'translateX(-50%)', width: '130px', height: '130px' },
    text: "Seu primeiro dia de aula! Será incrivel!",
    choices: [
      { label: "Explorar o campus", nextScene: 1 },
      { label: "Ir para a sala de aula", nextScene: 2 }
    ]
  },
  {
    // Cena 1: Pátio do Instituto Federal
    background: "../Assets/Cenarios/Refeitorio.png",
    sprite: playerSprite,
    position: { left: '55%', bottom: '0px', transform: 'translateX(-50%)', width: '300px', height: '300px' },
    text: "Você caminha pelo pátio e vê estudantes conversando.",
    choices: [
      { label: "Falar com veteranos", nextScene: 3 },
      { label: "Ir para Sala", nextScene: 2 }
    ]
  },
  {
    // Cena 2: Sala de Aula
    background: "../Assets/Cenarios/Fala_Jovem.png",
    sprite: playerSprite,
    position: { left: '55%', bottom: '0px', transform: 'translateX(-50%)', width: '180px', height: '180px' },
    text: "Você entra na sala errada, e o professor João te questiona, responder:  ",
    choices: [
      { label: "De forma grosseira: \"Eu vou ficar aqui! To nem aí...\"", nextScene: 4 },
      { label: "Pedir desculpas e ir para o corredor.", nextScene: 3 }
    ]
  },
  {
    // Cena 3: Corredor bullying
    background: "../Assets/Cenarios/Corredor_Porta_Azul_Fundo.png",
    sprite: playerSprite,
    position: { left: '45%', bottom: '0px', transform: 'translateX(-50%)', width: '300px', height: '300px' },
    text: "O tempo passa... Início de jornada concluído.",
    choices: [
      { label: "Reiniciar", nextScene: 0 }
    ]
  },
  {
    // Cena 4: Etep - Diretoria
    background: "../Assets/Cenarios/Diretoria-Etep.png",
    sprite: playerSprite,
    position: { left: '65%', bottom: '0px', transform: 'translateX(-50%)', width: '200px', height: '200px' },
    text: "Você foi para a diretoria e recebeu 1 ETEP e perdeu 50 social credits por sua atitude.",
    choices: [
      { label: "Reiniciar", nextScene: 0 }
    ]
  }
];

let state = scenes[0]; // estado inicial

const sceneEl = document.querySelector("#scene");
const spriteLayerEl = document.querySelector("#sprite-layer"); // Renomeie para clareza
const spriteEl = document.querySelector("#sprite");
const textEl = document.querySelector("#scene-text");
const choicesEl = document.querySelector("#choices");
const scEl = document.querySelector("#sc");
const etepEl = document.querySelector("#etep");

//troca de cena
function applyChoice(choice) {
  if (typeof choice.nextScene === "number" && scenes[choice.nextScene]) {
    // Incremento da ETEP (cena 4) corrigido
    if (choice.nextScene === 4) {
      const newEtepVal = getInt('etep') + 1;
      sessionStorage.setItem('etep', newEtepVal);
      etepEl.textContent = newEtepVal;

      const newCreditsVal = getInt('credits') - 50;
      sessionStorage.setItem('credits', newCreditsVal);
      scEl.textContent = newCreditsVal;
      
    }

    if(etepEl.textContent == 3){
      state = scenes[0];
      alert(" Você alcançou 3 ETEPs e foi banido da escola!");
      sessionStorage.setItem('etep', 0);
      sessionStorage.setItem('credits', 0); 

      renderScene();
      return; 
    }
    state = scenes[choice.nextScene];
    renderScene();
  } else {
    console.warn("Cena destino inválida:", choice.nextScene);
  }
}

function renderScene() {
  const scene = state;
  sceneEl.style.backgroundImage = `url("${scene.background}")`;
  spriteEl.src = scene.sprite;
  Object.assign(spriteLayerEl.style, scene.position);
  textEl.textContent = scene.text;
  choicesEl.innerHTML = "";
  // Atualiza stats UMA vez fora do loop
  etepEl.textContent = getInt('etep');
  scEl.textContent = getInt('credits');
  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.label;
    btn.onclick = () => applyChoice(choice);
    choicesEl.appendChild(btn);
  });
}

// Inicialização
document.getElementById("char").textContent = playerName;
renderScene();