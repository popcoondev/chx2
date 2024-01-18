<template>
  <div class="piano-keyboard">
    <button
      v-for="note in notes"
      :key="note.label"
      :class="['keyboard-key', note.color]"
    >
      {{ note.label }}

    </button>
  </div>
</template>

<script>
export default {
  name: "PianoKeyboard",
  data() {
    return {
      notes: this.generateChromaticNotes(),
    };
  },
  methods: {
    generateChromaticNotes() {
      const notesSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let notes = [];
      for (let i = 0; i < 8; i++) { // 8行分のノートを生成
        for (let j = 0; j < 8; j++) { // 各行に8つのノートを配置
          const noteIndex = (i + j * 5) % 12; // 4度の間隔でノートを配置
          const octave = Math.floor((i + j * 5) / 12) + 2; // オクターブを追加（C1から始まるように+2）
          //const label = notesSequence[noteIndex] + octave;
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
  },
};

</script>

<style>
.piano-keyboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.keyboard-key {
  aspect-ratio: 1 / 1;
  width: 80px;
  border: 1px solid #ddd;
}

.keyboard-key.cyan {
  background-color: #00ffff; /* メジャー音 */
  opacity: 0.6;
}

.keyboard-key.gray {
  background-color: #c0c0c0; /* マイナー音 */
  opacity: 0.6;
}

.keyboard-key.pink {
  background-color: #ff00ff; /* C音 */
  opacity: 0.6;
}

.keyboard-octave {
  font-size: 8px;
}
</style>
