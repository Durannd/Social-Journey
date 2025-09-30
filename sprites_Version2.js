// Animação simples de 2 frames alternando o src de um <img>.
// Uso:
// const anim = createTwoFrameAnimator(imgEl, ["imgs/ana_1.png", "imgs/ana_2.png"], 4);
// anim.start(); anim.stop(); anim.setFrames([...]); anim.destroy();

export function createTwoFrameAnimator(imgEl, frames, fps = 4) {
  let _frames = Array.isArray(frames) ? frames.slice(0, 2) : [];
  let _fps = Math.max(1, fps);
  let idx = 0;
  let timer = null;
  let running = false;

  // Preload leve
  function preload(list) {
    list.forEach(src => { const i = new Image(); i.src = src; });
  }

  function applyFrame() {
    if (!_frames.length) return;
    imgEl.src = _frames[idx];
  }

  function tick() {
    idx = (idx + 1) % _frames.length;
    applyFrame();
  }

  function start() {
    if (!_frames.length || running) return;
    running = true;
    idx = 0;
    applyFrame();
    const interval = 1000 / _fps;
    timer = setInterval(tick, interval);
  }

  function stop() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    timer = null;
  }

  function setFrames(nextFrames) {
    const f = Array.isArray(nextFrames) ? nextFrames.slice(0, 2) : [];
    stop();
    _frames = f;
    preload(_frames);
    idx = 0;
    applyFrame();
  }

  function setFps(nextFps) {
    _fps = Math.max(1, nextFps || 1);
    if (running) {
      stop();
      start();
    }
  }

  function destroy() {
    stop();
    // Nada adicional a limpar além do timer
  }

  // Respeita preferência do usuário para reduzir movimentos
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (mq?.matches) {
    // Apenas mostra o primeiro frame e não anima
    if (_frames.length) imgEl.src = _frames[0];
    return { start() {}, stop, setFrames, setFps, destroy };
  }

  preload(_frames);
  return { start, stop, setFrames, setFps, destroy };
}