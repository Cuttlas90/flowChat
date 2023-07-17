import { OggOpusDecoderWebWorker } from 'ogg-opus-decoder';

export async function  DecoderOPUS(uint8Array) {
  var blob ;
  
  const decoder = new OggOpusDecoderWebWorker({ forceStereo: true });
  await decoder.decode(uint8Array).then((res) => {
    const [left, right] =  [res.channelData[0], res.channelData[1]]
    const interleaved = new Float32Array(left.length + right.length)
    for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
      interleaved[dst] = left[src]
      interleaved[dst + 1] = right[src]
    }
    const wavBytes = getWavBytes(interleaved.buffer, {
      isFloat: true,       // floating point or 16-bit integer
      numChannels: 2,
      sampleRate: 48000,
    })
    const wav = new Blob([wavBytes], { type: 'audio/wav' })
    var url = URL.createObjectURL(wav);
    blob= url;
  }
  );


  function getWavBytes(buffer, options) {
    const type = options.isFloat ? Float32Array : Uint16Array
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

    const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }))
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0)
    wavBytes.set(new Uint8Array(buffer), headerBytes.length)

    return wavBytes
  }

  function getWavHeader(options) {
    const numFrames = options.numFrames
    const numChannels = options.numChannels || 2
    const sampleRate = options.sampleRate || 44100
    const bytesPerSample = options.isFloat ? 4 : 2
    const format = options.isFloat ? 3 : 1

    const blockAlign = numChannels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = numFrames * blockAlign

    const buffer = new ArrayBuffer(44)
    const dv = new DataView(buffer)

    let p = 0

    function writeString(s) {
      for (let i = 0; i < s.length; i++) {
        dv.setUint8(p + i, s.charCodeAt(i))
      }
      p += s.length
    }

    function writeUint32(d) {
      dv.setUint32(p, d, true)
      p += 4
    }

    function writeUint16(d) {
      dv.setUint16(p, d, true)
      p += 2
    }

    writeString('RIFF')              // ChunkID
    writeUint32(dataSize + 36)       // ChunkSize
    writeString('WAVE')              // Format
    writeString('fmt ')              // Subchunk1ID
    writeUint32(16)                  // Subchunk1Size
    writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
    writeUint16(numChannels)         // NumChannels
    writeUint32(sampleRate)          // SampleRate
    writeUint32(byteRate)            // ByteRate
    writeUint16(blockAlign)          // BlockAlign
    writeUint16(bytesPerSample * 8)  // BitsPerSample
    writeString('data')              // Subchunk2ID
    writeUint32(dataSize)            // Subchunk2Size

    return new Uint8Array(buffer)
  }
    return(blob);
  }
