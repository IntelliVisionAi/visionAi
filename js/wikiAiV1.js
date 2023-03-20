const endpointUrl = 'https://en.wikipedia.org/w/api.php';
const format = 'json';
const action = 'query';
const prop = 'extracts';
const origin = '*';

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

  if (message !== '') {
    addChatBubble(message, true);
    input.value = '';

    getWikipediaData(message)
      .then(extract => {
        addChatBubble(extract, false);
      })
      .catch(error => {
        console.error(error);
        addChatBubble(error.message, false);
      });
  }
}

function addChatBubble(text, isUser) {
  const chatBubble = document.createElement('div');
  chatBubble.classList.add('chat-bubble');
  chatBubble.classList.add(isUser ? 'user' : 'bot');
  chatBubble.innerHTML = `<span>${text}</span>`;
  chatContainer.appendChild(chatBubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function getWikipediaData(searchTerm) {
    const params = new URLSearchParams({
        format: format,
        action: action,
        prop: prop,
        exintro: true, // Limit to introduction section
        titles: searchTerm,
        origin: origin
    });

    const response = await fetch(`${endpointUrl}?${params}`);
    const data = await response.json();

    const page = data.query.pages[Object.keys(data.query.pages)[0]];

    if (!page || !page.extract) {
        throw new Error(`No page found for "${searchTerm}".`);
    }

    // Remove HTML tags, bullet points, and listen markers
    const extract = page.extract
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/^\s*[\*\•]\s*/gm, '') // Remove bullet points
        .replace(/{{listen[^}]*}}|\(\(listen\)\)/g, '') // Remove listen markers
        .replace(/\s*\(([^)]*)\)\s*/g, ''); // Remove parentheses

    // Limit to 3 sentences
    const summary = extract.split('.').slice(0, 5).join('.') + '.';

    return summary;
}
  