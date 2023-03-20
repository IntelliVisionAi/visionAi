// Get the form elements
const voiceSelect = document.getElementById('voice-select');
const volumeSlider = document.getElementById('volume-slider');
const pitchSlider = document.getElementById('pitch-slider');
const speedSlider = document.getElementById('speed-slider');
const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-button');
const volumeValue = document.getElementById('volume-value');
const pitchValue = document.getElementById('pitch-value');
const speedValue = document.getElementById('speed-value');
const form = document.querySelector('form');

// Create a new SpeechSynthesisUtterance object
const utterance = new SpeechSynthesisUtterance();

// Populate the voice select dropdown with available voices
function populateVoices() {
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Update the utterance with the form values
function updateUtterance() {
  const selectedVoice = voiceSelect.value;
  const volume = volumeSlider.value;
  const pitch = pitchSlider.value;
  const rate = speedSlider.value;
  const text = textInput.value;

  // Find the selected voice and update the utterance
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.name === selectedVoice);
  utterance.voice = voice;

  utterance.volume = volume;
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.text = text;

  // Update the slider value display
  volumeValue.textContent = volume;
  pitchValue.textContent = pitch;
  speedValue.textContent = rate;
}

// Speak the text
function speakText() {
  updateUtterance();
  speechSynthesis.speak(utterance);
}

// Stop speaking
function stopSpeaking() {
  speechSynthesis.cancel();
}

// Event listeners
window.addEventListener('load', () => {
  populateVoices();
  speechSynthesis.addEventListener('voiceschanged', populateVoices);
});
voiceSelect.addEventListener('change', updateUtterance);
volumeSlider.addEventListener('input', updateUtterance);
pitchSlider.addEventListener('input', updateUtterance);
speedSlider.addEventListener('input', updateUtterance);
speakButton.addEventListener('click', () => {
  if (speechSynthesis.speaking) {
    stopSpeaking();
    speakButton.textContent = 'Speak';
  } else {
    speakText();
    speakButton.textContent = 'Stop';
  }
});

// Handle speech synthesis events
utterance.onstart = () => {
  speakButton.disabled = true;
};

utterance.onend = () => {
  speakButton.disabled = false;
  speakButton.textContent = 'Speak';
};

utterance.onerror = () => {
  speakButton.disabled = false;
  speakButton.textContent = 'Speak';
};

// Prevent the form from submitting on button click
form.addEventListener('submit', e => {
    e.preventDefault();
  });
  