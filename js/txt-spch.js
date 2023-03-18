// Get DOM Elements
const textInput = document.querySelector("#text");
const voicesSelect = document.querySelector("#voices");
const volumeSlider = document.querySelector("#volume");
const pitchSlider = document.querySelector("#pitch");
const rateSlider = document.querySelector("#rate");
const speakButton = document.querySelector("#speak");

// Init Speech Synthesis
const synth = window.speechSynthesis;

// Get Voices
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.innerText = `${voice.name} (${voice.lang})`;
    voicesSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }

  if (textInput.value !== "") {
    const utterance = new SpeechSynthesisUtterance(textInput.value);

    utterance.onstart = () => {
      speakButton.disabled = true;
      speakButton.innerText = "Speaking...";
    };

    utterance.onend = () => {
      speakButton.disabled = false;
      speakButton.innerText = "Speak";
    };

    const selectedVoice = voices.find(
      (voice) => voice.name === voicesSelect.value
    );
    utterance.voice = selectedVoice;

    utterance.volume = volumeSlider.value;
    utterance.pitch = pitchSlider.value;
    utterance.rate = rateSlider.value;

    synth.speak(utterance);
  }
};

// Event Listeners
speakButton.addEventListener("click", speak);
