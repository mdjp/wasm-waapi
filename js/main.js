const ctx = new AudioContext();
if (ctx.audioWorklet === undefined) {
  alert("AudioWorklet isn't supported")
} else {
  ctx.audioWorklet.addModule('js/gain-processor.js').then(() => {
    const n = new AudioWorkletNode(ctx, 'mp-processor')
    const o =  ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = 0.1;
    o.frequency.value = 220;
    o.connect(g);
    g.connect(n);
    o.start();

    n.connect(ctx.destination);
    

    fetch('src/output/gain.wasm')
      .then(r => r.arrayBuffer())
      .then(r => n.port.postMessage({ type: 'loadWasm', data: r }))
 
    //   n.parameters.get('gain').value = 1;
    //   n.port.postMessage({ type: 'gain' })
    })
}

function resume(){
    ctx.resume();

}