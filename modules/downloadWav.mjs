/*

Big thanks to Russel Good for the tutorial on this topic:
https://www.russellgood.com/how-to-convert-audiobuffer-to-audio-file/

*/

export function donwloadAsWAV(buffer, total_samples) {
	var file = URL.createObjectURL(bufferToWave(buffer, total_samples));

	var a = document.createElement("a");
	a.href = file;
	var name = `sound.wav`;
    a.download = name;
    a.click();
}

function bufferToWave(buffer, len) {
  var channelNum = buffer.numberOfChannels,
      length = len * channelNum * 2 + 44,
      outBuffer = new ArrayBuffer(length),
      view = new DataView(outBuffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(channelNum);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * channelNum); // avg. bytes/sec
  setUint16(channelNum * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for(i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < channelNum; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);          // write 16-bit sample
      pos += 2;
    }
    offset++                                     // next source sample
  }

  // create Blob
  return new Blob([outBuffer], {type: "audio/wav"});

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}
