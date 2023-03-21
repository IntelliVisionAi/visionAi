const endpointUrl = 'http://api.mathjs.org/v4/';
const wikipediaEndpointUrl = 'https://en.wikipedia.org/w/api.php';
const chatContainer = document.querySelector('.chat-container');
const input = document.querySelector('input');
const button = document.querySelector('button');

button.addEventListener('click', sendMessage);
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = input.value.trim();
  const api = document.querySelector("#api-select").value;

  if (message !== '') {
    addChatBubble(message, true);
    input.value = '';

    if (api === 'mathjs') {
      fetch(`${endpointUrl}?expr=${encodeURIComponent(message)}`)
        .then(response => response.text())
        .then(result => {
          addChatBubble(result, false);
        })
        .catch(error => {
          console.error(error);
          addChatBubble(error.message, false);
        });
      } else if (api === 'wikipedia') {
      getWikipediaData(message)
        .then(extract => {
          addChatBubble(extract, false);
        })
        .catch(error => {
          console.error(error);
          addChatBubble(error.message, false);
        });
        
      } else if (api === 'dictionary') {
        fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(message)}?key=29443b6f-f2cd-4fdb-857d-43e6e27f3e34`)
          .then(response => response.json())
          .then(data => {
            const definition = data[0].shortdef[0];
            addChatBubble(definition, false);
          })
          .catch(error => {
            console.error(error);
            addChatBubble(error.message, false);
          });
      }
    }
  }

function addChatBubble(text, isUser) {
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('chat-bubble');
  chatBubble.classList.add(isUser ? 'user' : 'bot');
  chatContainer.appendChild(chatBubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Split the text into characters and add them one by one with a delay
  const characters = text.split('');
  let i = 0;
  const intervalId = setInterval(() => {
    if (i < characters.length) {
      const character = characters[i];
      chatBubble.innerHTML += character;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      i++;
    } else {
      clearInterval(intervalId);
    }
  }, 25);
}

async function getWikipediaData(searchTerm) {
  const format = 'json';
  const action = 'query';
  const prop = 'extracts';
  const origin = '*';

  const params = new URLSearchParams({
    format: format,
    action: action,
    prop: prop,
    exintro: true,
    titles: searchTerm,
    origin: origin,
  });

  const response = await fetch(`${wikipediaEndpointUrl}?${params}`);
  const data = await response.json();

  const page = data.query.pages[Object.keys(data.query.pages)[0]];

  if (!page || !page.extract) {
    throw new Error(`No page found for "${searchTerm}".`);
  }

  const extract = page.extract
  .replace(/<[^>]*>/g, '') // Remove HTML tags
  .replace(/^\s*[\*\•]\s*/gm, '') // Remove bullet points
  .replace(/{{listen[^}]*}}|\(\(listen\)\)/g, '') // Remove listen markers
  .replace(/\s*\(([^)]*)\)\s*/g, ''); // Remove parentheses

  const summary = extract.split('.').slice(0, 5).join('.') + '.';

  return summary;
}
