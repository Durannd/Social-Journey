import { scenes } from "./scenes.js";
import { createTwoFrameAnimator } from "./sprites.js";

const state = {
  sc: 100,     // Social Credits iniciais
  etep: 0,     // ETEPs iniciais
  character: null,
  current: "choose-character"
};

const scEl = document.getElementById("sc");
const etepEl = document.getElementById("etep");
const charEl = document.getElementById("char");
const sceneEl = document.getElementById("scene");
const sceneTextEl = document.getElementById("scene-text");
const choicesEl = document.getElementById("choices");
const endScreenEl = document.getElementById("end-screen");
const endTitleEl = document.getElementById("end-title");
const endMessageEl = document.getElementById("end-message");
const restartBtn = document.getElementById("restart-btn");

const spriteLayer = document.getElementById("sprite-layer");
const charSpriteEl = document.getElementById("char-sprite");

let animator = null;

restartBtn.addEventListener("click", () => restartGame());

function startGame() {
  render();
}

function render() {
  // Atualiza stats UI
  scEl.textContent = state.sc;
  etepEl.textContent = state.etep;
  charEl.textContent = state.character ?? "—";

  // Checa expulsão
  if (state.etep >= 3) {
    return endGameExpelled();
  }

  const scene = scenes[state.current];
  if (!scene) {
    console.warn("Cena não encontrada:", state.current);
    return endGameWithMessage("Fim", "Obrigado por jogar!");
  }

  // Atualiza bg da cena (opcional)
  if (scene.bg) {
    sceneEl.style.backgroundImage = `url('${scene.bg}')`;
  } else {
    sceneEl.style.backgroundImage = "none";
  }

  // Renderiza texto e escolhas
  sceneTextEl.innerHTML = interpolateText(scene.text);
  choicesEl.innerHTML = "";
  (scene.choices ?? []).forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = choice.text;
    btn.addEventListener("click", () => applyChoice(choice));
    choicesEl.appendChild(btn);
  });

  // Atualiza/mostra sprite do personagem (2 frames)
  updateCharacterSprite();
}

function updateCharacterSprite() {
  const name = state.character;
  if (!name) {
    spriteLayer.style.display = "none";
    animator?.stop();
    return;
  }
  const frames = getCharacterIdleFrames(name);
  if (!frames.length) {
    spriteLayer.style.display = "none";
    animator?.stop();
    return;
  }

  spriteLayer.style.display = "flex";

  if (!animator) {
    animator = createTwoFrameAnimator(charSpriteEl, frames, 4); // 4 FPS = leve
    animator.start();
  } else {
    animator.setFrames(frames);
    animator.setFps(4);
    animator.start();
  }
}

function getCharacterIdleFrames(name) {
  // Ajuste os caminhos dos sprites conforme sua pasta
  // Crie as imagens abaixo:
  // imgs/characters/ana_idle_1.png
  // imgs/characters/ana_idle_2.png
  // imgs/characters/bruno_idle_1.png ...
  // imgs/characters/carla_idle_1.png ...
  const base = "imgs/characters";
  const id = (name || "").toLowerCase();
  switch (id) {
    case "ana":
      return [`${base}/ana_idle_1.png`, `${base}/ana_idle_2.png`];
    case "bruno":
      return [`${base}/bruno_idle_1.png`, `${base}/bruno_idle_2.png`];
    case "carla":
      return [`${base}/carla_idle_1.png`, `${base}/carla_idle_2.png`];
    default:
      return [];
  }
}

function applyChoice(choice) {
  if (typeof choice.sc === "number") state.sc += choice.sc;
  if (typeof choice.etep === "number") state.etep += choice.etep;

  if (choice.set && typeof choice.set === "object") {
    Object.assign(state, choice.set);
  }

  if (state.etep >= 3) return endGameExpelled();

  const next = choice.next ?? state.current;
  if (next === "END") return endGameByScore();

  state.current = next;
  render();
}

function interpolateText(text) {
  return (text || "").replaceAll("{character}", state.character ?? "Você");
}

function endGameExpelled() {
  endGameWithMessage(
    "Você foi expulso(a).",
    "Você acumulou 3 ETEPs. Reflita sobre suas escolhas e tente novamente."
  );
}

function endGameByScore() {
  const { title, message } = computeEndingByScore(state.sc, state.etep);
  endGameWithMessage(title, message);
}

function computeEndingByScore(sc, etep) {
  if (etep >= 3) {
    return { title: "Fim do jogo", message: "Você foi expulso(a)." };
  }
  if (sc >= 120) {
    return {
      title: "Exemplo de Cidadania!",
      message: `Parabéns! Seu desempenho social foi excelente (${sc} Social Credits).`
    };
  } else if (sc >= 80) {
    return {
      title: "Bom Cidadão(ã)",
      message: `Muito bem! Você fez boas escolhas (${sc} Social Credits).`
    };
  } else if (sc >= 50) {
    return {
      title: "Regular",
      message: `Foi por pouco! Procure fazer escolhas melhores (${sc} Social Credits).`
    };
  } else {
    return {
      title: "Precisa Melhorar",
      message: `Suas escolhas tiveram consequências negativas (${sc} Social Credits). Reflita e tente de novo.`
    };
  }
}

function endGameWithMessage(title, message) {
  endTitleEl.textContent = title;
  endMessageEl.textContent = message;

  endScreenEl.classList.remove("hidden");
  document.getElementById("scene-text").innerHTML = "";
  document.getElementById("choices").innerHTML = "";

  // Para a animação durante a tela final
  animator?.stop();
  spriteLayer.style.display = "none";
}

function restartGame() {
  state.sc = 100;
  state.etep = 0;
  state.character = null;
  state.current = "choose-character";
  endScreenEl.classList.add("hidden");
  render();
}

// Inicializa o jogo
startGame();