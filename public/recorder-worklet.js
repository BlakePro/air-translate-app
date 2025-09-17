class MicProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0].length > 0) {
      // Send mono Float32Array
      this.port.postMessage({
        type: "audio",
        data: new Float32Array(input[0])
      });
    }
    return true;
  }
}

registerProcessor("mic-processor", MicProcessor);
