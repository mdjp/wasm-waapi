class MPProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return [
        {
          name: 'gain',
          defaultValue: 1
        }
      ]
    }
  
    constructor() {
        super();
        this.port.onmessage = e => {
          if (e.data.type === "loadWasm") {
              console.log(e.data.wasm);
            this._size = 128;
            //if (e.data.wasm) {
              var instance = new WebAssembly.Instance(
                new WebAssembly.Module(e.data.data),
                {}
              );
              this._wasm = instance;
              this._process = this._wasm.exports.process;
              this._set_load = this._wasm.exports.set_load;
              this._inPtr = this._wasm.exports.alloc(this._size * 4);
              this._outPtr = this._wasm.exports.alloc(this._size * 4);
              this._inBuf = new Float32Array(
                this._wasm.exports.memory.buffer,
                this._inPtr,
                this._size
              );
              this._outBuf = new Float32Array(
                this._wasm.exports.memory.buffer,
                this._outPtr,
                this._size
              );
            //} 
          } else if (e.data.type === "set-load") {
            this._set_load(e.data.data);
          } else {
            throw "unexpected.";
          }
        };
      }
  
    process(inputs, outputs, parameters) {
        if (!this._process) {
          return true;
        }
    
        let output = outputs[0];
        let input = inputs[0];
        for (let channel = 0; channel < input.length; ++channel) {
          for (var i = 0; i < 128; i++) {
            this._inBuf[i] = input[channel][i];
          }
        }
        for (let channel = 0; channel < output.length; channel++) {
          let outputChannel = output[channel];
          this._process(this._inPtr, this._outPtr, this._size);
          outputChannel.set(this._outBuf);
        }
    
        return true;
      }
    }
  
  registerProcessor('mp-processor', MPProcessor)