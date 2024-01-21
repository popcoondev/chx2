
<template>
  <div class="keyboard-container">
    <div class="midi-controller">
      <button class="midi-button connect-midi" @click="connectMIDI">Connect MIDI</button>
      <button class="midi-button disconnect-midi" @click="disconnectMIDI">Disconnect MIDI</button>
      <button class="midi-button" @click="someMethod">MIDI TEST</button>
      <div class="midi-connection-status" :class="{ 'connected': midiConnected }">
        {{ midiConnected ? 'Connected' : 'Not Connected' }}
      </div>
    </div>
    <div class="piano-keyboard">
      <button
        v-for="note in notes"
        :key="note.label"
        :class="[
          'keyboard-key', 
          note.color, 
          note.label !== 'C' ? 'octave-' + note.octave : '', 
          { 'active': note.isActive }]"
        @click="toggleNote(note)"
      >
        {{ note.label }}

      </button>
    </div>
  </div>
</template>

<script>
import { EventBus } from './eventBus.js';
import * as MidiController from '@/components/midiController';
const notesSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chords = {
        // C系コード
        'C': ['C', 'E', 'G'],
        'Cm': ['C', 'D#', 'G'],
        'C7': ['C', 'E', 'G', 'A#'],
        'Cm7': ['C', 'D#', 'G', 'A#'],
        'Cmaj7': ['C', 'E', 'G', 'B'],
        'Cdim': ['C', 'D#', 'F#'],
        'Caug': ['C', 'E', 'G#'],
        'Csus2': ['C', 'D', 'G'],
        'Csus4': ['C', 'F', 'G'],
        'Cadd9': ['C', 'E', 'G', 'D'],
        //'C6': ['C', 'E', 'G', 'A'],
        //'Cm6': ['C', 'D#', 'G', 'A'],
        'C7#9': ['C', 'E', 'G', 'A#', 'D#'],
        'C9': ['C', 'E', 'G', 'A#', 'D'],
        'C11': ['C', 'E', 'G', 'A#', 'D', 'F'],
        'C13': ['C', 'E', 'G', 'A#', 'D', 'F', 'B'],
        'Cm7b5': ['C', 'D#', 'F#', 'A#'],
        'Cm9': ['C', 'D#', 'G', 'A#', 'D'],
        'Cm11': ['C', 'D#', 'G', 'A#', 'D', 'F'],
        'Cm13': ['C', 'D#', 'G', 'A#', 'D', 'F', 'B'],

        // C#系コード
        'C#': ['C#', 'F', 'G#'],
        'C#m': ['C#', 'E', 'G#'],
        'C#7': ['C#', 'F', 'G#', 'B'],
        'C#m7': ['C#', 'E', 'G#', 'B'],
        'C#maj7': ['C#', 'F', 'G#', 'C'],
        'C#dim': ['C#', 'E', 'G'],
        'C#aug': ['C#', 'F', 'A'],
        'C#sus2': ['C#', 'D#', 'G#'],
        'C#sus4': ['C#', 'F#', 'G#'],
        'C#add9': ['C#', 'F', 'G#', 'D#'],
        //'C#6': ['C#', 'F', 'G#', 'A#'],
        //'C#m6': ['C#', 'E', 'G#', 'A#'],
        'C#7#9': ['C#', 'F', 'G#', 'B', 'D'],
        'C#9': ['C#', 'F', 'G#', 'B', 'D#'],
        'C#11': ['C#', 'F', 'G#', 'B', 'D#', 'F#'],
        'C#13': ['C#', 'F', 'G#', 'B', 'D#', 'F#', 'C'],
        'C#m7b5': ['C#', 'E', 'G', 'B'],
        'C#m9': ['C#', 'E', 'G#', 'B', 'D#'],
        'C#m11': ['C#', 'E', 'G#', 'B', 'D#', 'F#'],
        'C#m13': ['C#', 'E', 'G#', 'B', 'D#', 'F#', 'C'],

        // D系コード
        'D': ['D', 'F#', 'A'],
        'Dm': ['D', 'F', 'A'],
        'D7': ['D', 'F#', 'A', 'C'],
        'Dm7': ['D', 'F', 'A', 'C'],
        'Dmaj7': ['D', 'F#', 'A', 'C#'],
        'Ddim': ['D', 'F', 'G#'],
        'Daug': ['D', 'F#', 'A#'],
        'Dsus2': ['D', 'E', 'A'],
        'Dsus4': ['D', 'G', 'A'],
        'Dadd9': ['D', 'F#', 'A', 'E'],
        //'D6': ['D', 'F#', 'A', 'B'],
        //'Dm6': ['D', 'F', 'A', 'B'],
        'D7#9': ['D', 'F#', 'A', 'C', 'E'],
        'D9': ['D', 'F#', 'A', 'C', 'E'],
        'D11': ['D', 'F#', 'A', 'C', 'E', 'G'],
        'D13': ['D', 'F#', 'A', 'C', 'E', 'G', 'B'],
        'Dm7b5': ['D', 'F', 'G#', 'C'],
        'Dm9': ['D', 'F', 'A', 'C', 'E'],
        'Dm11': ['D', 'F', 'A', 'C', 'E', 'G'],
        'Dm13': ['D', 'F', 'A', 'C', 'E', 'G', 'B'],

        // D#系コード
        'D#': ['D#', 'G', 'A#'],
        'D#m': ['D#', 'F#', 'A#'],
        'D#7': ['D#', 'G', 'A#', 'C#'],
        'D#m7': ['D#', 'F#', 'A#', 'C#'],
        'D#maj7': ['D#', 'G', 'A#', 'D'],
        'D#dim': ['D#', 'F#', 'A'],
        'D#aug': ['D#', 'G', 'B'],
        'D#sus2': ['D#', 'F', 'A#'],
        'D#sus4': ['D#', 'G#', 'A#'],
        'D#add9': ['D#', 'G', 'A#', 'F'],
        //'D#6': ['D#', 'G', 'A#', 'C'],
        //'D#m6': ['D#', 'F#', 'A#', 'C'],
        'D#7#9': ['D#', 'G', 'A#', 'C#', 'F'],
        'D#9': ['D#', 'G', 'A#', 'C#', 'F#'],
        'D#11': ['D#', 'G', 'A#', 'C#', 'F#', 'G#'],
        'D#13': ['D#', 'G', 'A#', 'C#', 'F#', 'G#', 'D'],
        'D#m7b5': ['D#', 'F#', 'A', 'C#'],
        'D#m9': ['D#', 'F#', 'A#', 'C#', 'F'],
        'D#m11': ['D#', 'F#', 'A#', 'C#', 'F', 'G#'],
        'D#m13': ['D#', 'F#', 'A#', 'C#', 'F', 'G#', 'D'],

        // E系コード
        'E': ['E', 'G#', 'B'],
        'Em': ['E', 'G', 'B'],
        'E7': ['E', 'G#', 'B', 'D'],
        'Em7': ['E', 'G', 'B', 'D'],
        'Emaj7': ['E', 'G#', 'B', 'D#'],
        'Edim': ['E', 'G', 'A#'],
        'Eaug': ['E', 'G#', 'C'],
        'Esus2': ['E', 'F#', 'B'],
        'Esus4': ['E', 'A', 'B'],
        'Eadd9': ['E', 'G#', 'B', 'F#'],
        //'E6': ['E', 'G#', 'B', 'C#'],
        //'Em6': ['E', 'G', 'B', 'C#'],
        'E7#9': ['E', 'G#', 'B', 'D', 'F'],
        'E9': ['E', 'G#', 'B', 'D', 'F#'],
        'E11': ['E', 'G#', 'B', 'D', 'F#', 'A'],
        'E13': ['E', 'G#', 'B', 'D', 'F#', 'A', 'C#'],
        'Em7b5': ['E', 'G', 'A#', 'D'],
        'Em9': ['E', 'G', 'B', 'D', 'F#'],
        'Em11': ['E', 'G', 'B', 'D', 'F#', 'A'],
        'Em13': ['E', 'G', 'B', 'D', 'F#', 'A', 'C#'],

        // F系コード
        'F': ['F', 'A', 'C'],
        'Fm': ['F', 'G#', 'C'],
        'F7': ['F', 'A', 'C', 'D#'],
        'Fm7': ['F', 'G#', 'C', 'D#'],
        'Fmaj7': ['F', 'A', 'C', 'E'],
        'Fdim': ['F', 'G#', 'B'],
        'Faug': ['F', 'A', 'C#'],
        'Fsus2': ['F', 'G', 'C'],
        'Fsus4': ['F', 'A#', 'C'],
        'Fadd9': ['F', 'A', 'C', 'G'],
        //'F6': ['F', 'A', 'C', 'D'],
        //'Fm6': ['F', 'G#', 'C', 'D'],
        'F7#9': ['F', 'A', 'C', 'D#', 'G'],
        'F9': ['F', 'A', 'C', 'D#', 'G#'],
        'F11': ['F', 'A', 'C', 'D#', 'G#', 'A#'],
        'F13': ['F', 'A', 'C', 'D#', 'G#', 'A#', 'D'],
        'Fm7b5': ['F', 'G#', 'B', 'D#'],
        'Fm9': ['F', 'G#', 'C', 'D#', 'G#'],
        'Fm11': ['F', 'G#', 'C', 'D#', 'G#', 'A#'],
        'Fm13': ['F', 'G#', 'C', 'D#', 'G#', 'A#', 'D'],

        // F#系コード
        'F#': ['F#', 'A#', 'C#'],
        'F#m': ['F#', 'A', 'C#'],
        'F#7': ['F#', 'A#', 'C#', 'E'],
        'F#m7': ['F#', 'A', 'C#', 'E'],
        'F#maj7': ['F#', 'A#', 'C#', 'F'],
        'F#dim': ['F#', 'A', 'C'],
        'F#aug': ['F#', 'A#', 'D'],
        'F#sus2': ['F#', 'G#', 'C#'],
        'F#sus4': ['F#', 'B', 'C#'],
        'F#add9': ['F#', 'A#', 'C#', 'G#'],
        //'F#6': ['F#', 'A#', 'C#', 'D#'],
        //'F#m6': ['F#', 'A', 'C#', 'D#'],
        'F#7#9': ['F#', 'A#', 'C#', 'E', 'G'],
        'F#9': ['F#', 'A#', 'C#', 'E', 'G#'],
        'F#11': ['F#', 'A#', 'C#', 'E', 'G#', 'A'],
        'F#13': ['F#', 'A#', 'C#', 'E', 'G#', 'A', 'D#'],
        'F#m7b5': ['F#', 'A', 'C', 'E'],
        'F#m9': ['F#', 'A', 'C#', 'E', 'G#'],
        'F#m11': ['F#', 'A', 'C#', 'E', 'G#', 'A'],
        'F#m13': ['F#', 'A', 'C#', 'E', 'G#', 'A', 'D#'],

        // G系コード
        'G': ['G', 'B', 'D'],
        'Gm': ['G', 'A#', 'D'],
        'G7': ['G', 'B', 'D', 'F'],
        'Gm7': ['G', 'A#', 'D', 'F'],
        'Gmaj7': ['G', 'B', 'D', 'F#'],
        'Gdim': ['G', 'A#', 'C#'],
        'Gaug': ['G', 'B', 'D#'],
        'Gsus2': ['G', 'A', 'D'],
        'Gsus4': ['G', 'C', 'D'],
        'Gadd9': ['G', 'B', 'D', 'A'],
        //'G6': ['G', 'B', 'D', 'E'],
        //'Gm6': ['G', 'A#', 'D', 'E'],
        'G7#9': ['G', 'B', 'D', 'F', 'A'],
        'G9': ['G', 'B', 'D', 'F', 'A#'],
        'G11': ['G', 'B', 'D', 'F', 'A#', 'C'],
        'G13': ['G', 'B', 'D', 'F', 'A#', 'C', 'E'],
        'Gm7b5': ['G', 'A#', 'C#', 'F'],
        'Gm9': ['G', 'A#', 'D', 'F', 'A'],
        'Gm11': ['G', 'A#', 'D', 'F', 'A', 'C'],
        'Gm13': ['G', 'A#', 'D', 'F', 'A', 'C', 'E'],

        // G#系コード
        'G#': ['G#', 'C', 'D#'],
        'G#m': ['G#', 'B', 'D#'],
        'G#7': ['G#', 'C', 'D#', 'F#'],
        'G#m7': ['G#', 'B', 'D#', 'F#'],
        'G#maj7': ['G#', 'C', 'D#', 'G'],
        'G#dim': ['G#', 'B', 'D'],
        'G#aug': ['G#', 'C', 'E'],
        'G#sus2': ['G#', 'A#', 'D#'],
        'G#sus4': ['G#', 'C#', 'D#'],
        'G#add9': ['G#', 'C', 'D#', 'A#'],
        //'G#6': ['G#', 'C', 'D#', 'F'],
        //'G#m6': ['G#', 'B', 'D#', 'F'],
        'G#7#9': ['G#', 'C', 'D#', 'F#', 'A#'],
        'G#9': ['G#', 'C', 'D#', 'F#', 'B'],
        'G#11': ['G#', 'C', 'D#', 'F#', 'B', 'C#'],
        'G#13': ['G#', 'C', 'D#', 'F#', 'B', 'C#', 'F'],
        'G#m7b5': ['G#', 'B', 'D', 'F#'],
        'G#m9': ['G#', 'B', 'D#', 'F#', 'A#'],
        'G#m11': ['G#', 'B', 'D#', 'F#', 'A#', 'C#'],
        'G#m13': ['G#', 'B', 'D#', 'F#', 'A#', 'C#', 'F'],

        // A系コード
        'A': ['A', 'C#', 'E'],
        'Am': ['A', 'C', 'E'],
        'A7': ['A', 'C#', 'E', 'G'],
        'Am7': ['A', 'C', 'E', 'G'],
        'Amaj7': ['A', 'C#', 'E', 'G#'],
        'Adim': ['A', 'C', 'D#'],
        'Aaug': ['A', 'C#', 'F'],
        'Asus2': ['A', 'B', 'E'],
        'Asus4': ['A', 'D', 'E'],
        'Aadd9': ['A', 'C#', 'E', 'B'],
        //'A6': ['A', 'C#', 'E', 'F#'],
        //'Am6': ['A', 'C', 'E', 'F#'],
        'A7#9': ['A', 'C#', 'E', 'G', 'B'],
        'A9': ['A', 'C#', 'E', 'G', 'B'],
        'A11': ['A', 'C#', 'E', 'G', 'B', 'D'],
        'A13': ['A', 'C#', 'E', 'G', 'B', 'D', 'F#'],
        'Am7b5': ['A', 'C', 'D#', 'G'],
        'Am9': ['A', 'C', 'E', 'G', 'B'],
        'Am11': ['A', 'C', 'E', 'G', 'B', 'D'],
        'Am13': ['A', 'C', 'E', 'G', 'B', 'D', 'F#'],

        // A#系コード
        'A#': ['A#', 'D', 'F'],
        'A#m': ['A#', 'C#', 'F'],
        'A#7': ['A#', 'D', 'F', 'G#'],
        'A#m7': ['A#', 'C#', 'F', 'G#'],
        'A#maj7': ['A#', 'D', 'F', 'A'],
        'A#dim': ['A#', 'C#', 'E'],
        'A#aug': ['A#', 'D', 'F#'],
        'A#sus2': ['A#', 'C', 'F'],
        'A#sus4': ['A#', 'D#', 'F'],
        'A#add9': ['A#', 'D', 'F', 'C'],
        //'A#6': ['A#', 'D', 'F', 'G'],
        //'A#m6': ['A#', 'C#', 'F', 'G'],
        'A#7#9': ['A#', 'D', 'F', 'G#', 'C'],
        'A#9': ['A#', 'D', 'F', 'G#', 'C#'],
        'A#11': ['A#', 'D', 'F', 'G#', 'C#', 'D#'],
        'A#13': ['A#', 'D', 'F', 'G#', 'C#', 'D#', 'G'],
        'A#m7b5': ['A#', 'C#', 'E', 'G#'],
        'A#m9': ['A#', 'C#', 'F', 'G#', 'C'],
        'A#m11': ['A#', 'C#', 'F', 'G#', 'C', 'D#'],
        'A#m13': ['A#', 'C#', 'F', 'G#', 'C', 'D#', 'G'],

        // B系コード
        'B': ['B', 'D#', 'F#'],
        'Bm': ['B', 'D', 'F#'],
        'B7': ['B', 'D#', 'F#', 'A'],
        'Bm7': ['B', 'D', 'F#', 'A'],
        'Bmaj7': ['B', 'D#', 'F#', 'A#'],
        'Bdim': ['B', 'D', 'F'],
        'Baug': ['B', 'D#', 'G'],
        'Bsus2': ['B', 'C#', 'F#'],
        'Bsus4': ['B', 'E', 'F#'],
        'Badd9': ['B', 'D#', 'F#', 'C#'],
        //'B6': ['B', 'D#', 'F#', 'G#'],
        //'Bm6': ['B', 'D', 'F#', 'G#'],
        'B7#9': ['B', 'D#', 'F#', 'A', 'C#'],
        'B9': ['B', 'D#', 'F#', 'A', 'D'],
        'B11': ['B', 'D#', 'F#', 'A', 'D', 'E'],
        'B13': ['B', 'D#', 'F#', 'A', 'D', 'E', 'G#'],
        'Bm7b5': ['B', 'D', 'F', 'A'],
        'Bm9': ['B', 'D', 'F#', 'A', 'D#'],
        'Bm11': ['B', 'D', 'F#', 'A', 'D#', 'E'],
        'Bm13': ['B', 'D', 'F#', 'A', 'D#', 'E', 'G#'],
      };

export default {
  name: "PianoKeyboard",
  data() {
    return {
      notes: this.generateChromaticNotes(),
      // MIDIデバイスの接続状態を管理するためのデータ
      midiConnected: false,
    };
  },
  created() {
    EventBus.on('activate-note', this.activateNote);
    EventBus.on('inactivate-note', this.inactivateNote);
    EventBus.on('activate-note-from-midi', this.activateNoteFromMidi);
    EventBus.on('deactivate-note-from-midi', this.deactivateNoteFromMidi);
    this.connectMIDI();
    this.inactivateNote();
  },
  mounted() {
    EventBus.on('activate-note', this.activateNote);
    EventBus.on('inactivate-note', this.inactivateNote);
  },
  beforeUnmount() {
    EventBus.off('activate-note', this.activateNote);
    EventBus.off('inactivate-note', this.inactivateNote);
  },
  methods: {
    someMethod() {
      const outputs = MidiController.getOutputDevices();
      const midiOutput = outputs[0]; // 最初のMIDI出力デバイスを使用
      const message = [0x90, 0x45, 0x7f]; // 送信するMIDIメッセージ
      MidiController.sendMIDIMessage(message, midiOutput); // MIDIメッセージを送信
    },
    async connectMIDI() {
      console.log('connectMIDI');
      try {
        await MidiController.connectMIDIDevices();
        this.midiConnected = true;
        console.log('MIDI devices are set up');
      } catch (error) {
        console.error('Failed to set up MIDI devices', error);
      }
    },
    async disconnectMIDI() {
      console.log('disconnectMIDI');
      try {
        await MidiController.disconnectMIDIDevices();
        this.midiConnected = false;
        console.log('MIDI devices are disconnected');
      } catch (error) {
        console.error('Failed to disconnect MIDI devices', error);
      }
    },
    generateChromaticNotes() {
      let notes = [];
      for (let i = 0; i < 8; i++) { // 8行分のノートを生成
        for (let j = 0; j < 8; j++) { // 各行に8つのノートを配置
          const noteIndex = (i + j * 5) % 12; // 4度の間隔でノートを配置
          const octave = Math.floor((i + j * 5) / 12) + 2; // オクターブを追加（C1から始まるように+2）

          const label = notesSequence[noteIndex];
          let color = 'cyan'; // デフォルトはメジャー音（水色）
          if (label.includes('#')) {
            color = 'gray'; // マイナー音（灰色）
          }
          if (notesSequence[noteIndex] === 'C') {
            color = 'pink'; // C音（ピンク色）
          }
          notes.push({ label, color, octave });
        }
      }

      // 配列を左90度回転
      // 1次元配列を8x8の二次元配列に変換
      let notes2D = [];
      while(notes.length) notes2D.push(notes.splice(0,8));

      //output用の配列定義
      var rotatedNotes = new Array(8);
      for(let i=0; i<8; i++) rotatedNotes[i] = new Array(8).fill(0);

      // 配列を90度回転
      let x,y;
      for(let i = 0; i < 8; i++) {
        x = i;
        for(let j = 0; j < 8; j++) {
          y = 7 - j;
          rotatedNotes[y][x] = notes2D[i][j];
        }
      }
      
      // 二次元配列を1次元配列にフラット化
      let flatRotatedNotes = rotatedNotes.flat();

      return flatRotatedNotes;
    },
    activateNote(noteLabel) {
      // 指定されたノートをアクティブに設定
      let notesToActivate = this.notes.filter(note => note.label === noteLabel);
      console.log(notesToActivate);  // この行を追加
      if (notesToActivate) {
        notesToActivate.forEach(note => {
          note.isActive = true;
        });
      }
    },
    inactivateNote() {
      console.log("inactivateNote");
      // 全てのノートを非アクティブに設定（オプション）
      this.notes.forEach(note => {
        note.isActive = false;
      });
    },
    activateNoteFromMidi(midiNote) {
      const appNote = this.convertMidiNoteToAppNote(midiNote);
      const notesToActivate = this.notes.filter(note => 
        note.label === appNote.note && note.octave === appNote.octave
      );

      notesToActivate.forEach(note => {
        note.isActive = true;
      });

      this.checkForChord();
    },
    deactivateNoteFromMidi(midiNote) {
      const appNote = this.convertMidiNoteToAppNote(midiNote);
      const notesToDeactivate = this.notes.filter(note => 
        note.label === appNote.note && note.octave === appNote.octave
      );

      notesToDeactivate.forEach(note => {
        note.isActive = false;
      });
    },
    convertMidiNoteToAppNote(midiNote) {
      
      const noteIndex = midiNote % 12;
      const octave = Math.floor(midiNote / 12) - 1; // MIDIオクターブはC-1から始まるため、1を減算
      const note = notesSequence[noteIndex];
      return { note, octave };
    },
    toggleNote(note) {
      // ノートのアクティブ状態を切り替える
      note.isActive = !note.isActive;
      this.checkForChord();
    },
    checkForChord() {
      console.log("checkForChord");
      let chordFound = false;
      const activeNotes = this.notes.filter(note => note.isActive).map(note => note.label);
      
      for (let chord in chords) {
        const chordNotes = chords[chord];

        if (chordNotes.every(note => activeNotes.includes(note)) &&
          activeNotes.every(note => chordNotes.includes(note))) {

          this.highlightChord(chord);
          chordFound = true;
          break;
        }
      }

      // コードが見つからなかった場合、ハイライトを解除
      if (!chordFound) {
        this.highlightChord(null);
      }
    },
    highlightChord(chord) {
      console.log("highlightChord " + chord);
      EventBus.emit('highlight-chord', chord);
    },
  },
};

</script>

<style>
.midi-controller {
  width: 100%;
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

}
.midi-button {
  margin: 0 10px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  color: #ddd;
  background-color: #222;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 0 2px 0 rgba(255, 255, 255, 0.5);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 12px;
  text-transform: uppercase;
}
.midi-button:hover {
  background-color: #333;
}
.midi-button:active {
  background-color: #444;
} 
.midi-connection-status {
  margin: 10px;
  color: #fff;
  font-size: 12px;
}
.midi-connection-status.connected {
  color: #0f0;
}

.keyboard-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 横方向の中央揃え */
  align-items: center; /* 縦方向の中央揃え */
}

.piano-keyboard {
  display: grid;
  grid-template-columns: repeat(8, 60px);
  gap: 10px;
}

.keyboard-key {
  aspect-ratio: 1 / 1;
  width: 60px;
  border: 2px solid #000;
  border-radius: 2px;
  color: #222;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 0 6px 0 rgba(255, 255, 255, 0.5);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 12px;
  text-transform: uppercase;



}

.keyboard-key.cyan {
  background-color: #00ffff; /* メジャー音 */
  
}

.keyboard-key.gray {
  background-color: #c0c0c0; /* マイナー音 */
  
}

.keyboard-key.pink {
  background-color: #ff00ff; /* C音 */
  border-color: #AA00AA;  
}

.keyboard-key.active {
  background-color: #00FF00; /* アクティブなキーを緑色に */

}

.keyboard-octave {
  font-size: 8px;
}

.keyboard-key.octave-1 {
  border-color: #A00;
}
.keyboard-key.octave-2 {
  border-color: #A50;
}
.keyboard-key.octave-3 {
  border-color: #AA0;
}
.keyboard-key.octave-4 {
  border-color: #5A5;
}
.keyboard-key.octave-5 {
  border-color: #0A5;
}
.keyboard-key.octave-6 {
  border-color: #0AA;
}
.keyboard-key.octave-7 {
  border-color: #5AA;
}
.keyboard-key.octave-8 {
  border-color: #AAA;
}
</style>
