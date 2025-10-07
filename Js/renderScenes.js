const playerSprite = sessionStorage.getItem('player_sprite') || "../Assets/Personagens_Usuario/menino_black.png";
const playerName   = sessionStorage.getItem('player_name') || '—';

// Substitui scene1 isolada por um array de cenas e corrige sprite.
const scenes = [
  {
    // Cena 0: Entrada do Instituto Federal
    background: "../Assets/Cenarios/Instituto_Federal_Frente.png",
    sprite: playerSprite,
    position: { left: '50%', bottom: '0px', transform: 'translateX(-50%)', width: '130px', height: '130px' },
    text: "Chegamos ao IF...",
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
    background: "../Assets/Cenarios/Sala.png",
    sprite: playerSprite,
    position: { left: '40%', bottom: '0px', transform: 'translateX(-50%)', width: '300px', height: '300px' },
    text: "Você entra na sala. Ainda está vazia.",
    choices: [
      { label: "Sentar e esperar", nextScene: 3 },
      { label: "Sair novamente", nextScene: 0 }
    ]
  },
  {
    // Cena 3: Conclusão
    background: "../Assets/Cenarios/Corredor_Porta_Azul_Fundo.png",
    sprite: playerSprite,
    position: { left: '45%', bottom: '0px', transform: 'translateX(-50%)', width: '300px', height: '300px' },
    text: "O tempo passa... Início de jornada concluído.",
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
    state = scenes[choice.nextScene];
    renderScene()
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