// midiController.js
import { EventBus } from './eventBus.js';

// MIDIアクセスオブジェクト
let midiAccess = null;

// 成功時のMIDIアクセスオブジェクトを保持する変数
let inputDevices = [];
let outputDevices = [];
let launchpadDevice = null;

const notesSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


// Launchpad XにMIDIメッセージを送信する関数
export function sendToLaunchpad(message) {
  if (launchpadDevice) {
    launchpadDevice.send(message);
  }
}

// MIDIデバイスのセットアップを行う関数
export async function connectMIDIDevices() {
  try {
    midiAccess = await navigator.requestMIDIAccess();

    // 入力デバイスを配列にセットアップ
    inputDevices = Array.from(midiAccess.inputs.values());
    inputDevices.forEach((input) => {
      input.onmidimessage = handleMIDIMessage;
    });

    // 出力デバイスを配列にセットアップ
    outputDevices = Array.from(midiAccess.outputs.values());
    
    // Launchpad Xを特定する
    outputDevices.forEach(output => {
      if (output.name.includes('Launchpad X')) {
        launchpadDevice = output;
      }
    });

    console.log('MIDI access obtained', midiAccess);
    console.log('MIDI Inputs:', inputDevices);
    console.log('MIDI Outputs:', outputDevices);
  } catch (error) {
    console.error('MIDI access denied', error);
  }
}

// Launchpad Xのパッドを光らせる関数
export function lightUpPad(note) {
  // ノートオンメッセージのフォーマット：[0x90, note, velocity]
  sendToLaunchpad([0x90, note, 127]);
}

// MIDIメッセージを送信してパッドを消灯させる関数
export function lightDownPad(note) {
  // MIDIノートオフメッセージは 0x80 (128) ステータスバイトから始まります。
  //const message = [0x80, midiNote, 0]; // 0 ベロシティは光を消す
  //outputDevices.forEach(output => output.send(message));
  sendToLaunchpad([0x80, note, 0]);
}

// MIDIメッセージを受け取ったときの処理を行う関数
function handleMIDIMessage(message) {
    console.log('MIDI message received', message);

    const command = message.data[0];
    const note = message.data[1];
    const velocity = message.data[2];

    // ノートオンメッセージを検出（ステータスバイトが0x90から0x9Fの範囲）
    if (command >= 0x90 && command <= 0x9F && velocity > 0) {
        console.log(`Note On: Note = ${note}, Velocity = ${velocity}`);
        // ここでアプリ内での対応するノートをアクティブにするなどの処理を行う
        EventBus.emit('activate-note-from-midi', note);
    }

    // ノートオフメッセージを検出（ステータスバイトが0x80から0x8Fの範囲、またはベロシティが0）
    if ((command >= 0x80 && command <= 0x8F) || (command >= 0x90 && command <= 0x9F && velocity === 0)) {
        console.log(`Note Off: Note = ${note}`);
        // ここでアプリ内での対応するノートを非アクティブにするなどの処理を行う
        EventBus.emit('deactivate-note-from-midi', note);
    }

    // その他のMIDIメッセージに対する処理...
}
  

// MIDIメッセージを送信する関数
export function sendMIDIMessage(message, midiOutput = null) {
  if (midiOutput) {
    midiOutput.send(message);
  } else {
    outputDevices.forEach(output => output.send(message));
  }
  console.log('MIDI message sent', message);
}

// MIDIデバイスのリリースを行う関数
export function disconnectMIDIDevices() {
  midiAccess.inputs.forEach(input => input.onmidimessage = null);
  midiAccess = null;
  inputDevices = [];
  outputDevices = [];
  launchpadDevice = null;
  console.log('MIDI access released');
}

// 出力デバイスを取得する関数
export function getOutputDevices() {
  return outputDevices;
}

// 入力デバイスを取得する関数
export function getInputDevices() {
  return inputDevices;
}

// noteToMidiKeyを取得する関数
export function getNoteToMidiKey(note, octave) {
  const noteIndex = notesSequence.indexOf(note);
  return 12 * octave + noteIndex;
}