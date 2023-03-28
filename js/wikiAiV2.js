const endpointUrl = 'http://api.mathjs.org/v4/';
const wikipediaEndpointUrl = 'https://en.wikipedia.org/w/api.php';
const unsplashAccessKey = 'o1t89hbooU9dUtQ9xv50O5MPCFu9Fz5ov8JlvVRmdU0';
const unsplashEndpointUrl = 'https://api.unsplash.com/photos/random';
const pexelsAccessKey = 'rSW05Ydphkp8H0XACPFJjlANoVJx1ccxx7J5zqf9vAIkkPvvBMpCy6pd';
const pexelsEndpointUrl = 'https://api.pexels.com/v1';
const flickrApiKey = '2bb91281a2b04211cf3f40e225a7dc56';
const flickrApiUrl = 'https://www.flickr.com/services/rest/';
const chatContainer = document.querySelector('.chat-container');
const input = document.querySelector('input');
const button = document.querySelector('button');

button.addEventListener('click', sendMessage);
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const message = input.value.trim();
  const api = document.querySelector("#api-select").value;

  if (message !== '') {
    addChatBubble(message, true);
    input.value = '';

    try {
      if (api === 'mathjs') {
        const response = await fetch(`${endpointUrl}?expr=${encodeURIComponent(message)}`);
        const result = await response.text();
        addChatBubble(result, false);
      } else if (api === 'wikipedia') {
        const extract = await getWikipediaData(message);
        addChatBubble(extract, false);
      } else if (api === 'dictionary') {
        const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(message)}?key=29443b6f-f2cd-4fdb-857d-43e6e27f3e34`);
        const data = await response.json();
        const definition = data[0].shortdef[0];
        addChatBubble(definition, false);
      } else if (api === 'image') {
        const imageUrl = await getRandomImage(message);
        if (imageUrl) {
          addChatBubble(imageUrl, false, true);
        } else {
          addChatBubble("There was no image in my database for that keyword.", false);
        }
      } else if (api === 'pexels') {
        const imageUrl = await getRandomImagePexels(message);
        if (imageUrl) {
          addChatBubble(imageUrl, false, true);
        } else {
          addChatBubble("There was no image in my database for that keyword", false);
        }
      } else if (api === 'flickr') {
        const imageUrl = await getRandomImageFlickr(message);
        if (imageUrl) {
          addChatBubble(imageUrl, false, true);
        } else {
          addChatBubble("There was no image in my database for that keyword.", false);
        }
}
} catch (error) {
console.error(error);
addChatBubble(error.message, false);
}
}
}


async function getRandomImageFlickr(keyword) {
  const query = keyword ? encodeURIComponent(keyword) : '';
  FLICKR_ACCESS_KEY = '2bb91281a2b04211cf3f40e225a7dc56'
  const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_ACCESS_KEY}&text=${query}&sort=relevance&format=json&nojsoncallback=1`;

  
  try {
  const response = await fetch(url);
  const data = await response.json();
  const photos = data.photos.photo;
  if (photos.length > 0) {
    const randomIndex = Math.floor(Math.random() * photos.length);
    const photo = photos[randomIndex];
    const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
    return imageUrl;
  } else {
    return null;
  }
} catch (error) {
  console.error(error);
  return null;
  }
  }



async function getRandomImage(keyword) {
  const query = keyword ? encodeURIComponent(keyword) : '';
  const url = `${unsplashEndpointUrl}?query=${query}&client_id=${unsplashAccessKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getRandomImagePexels(keyword) {
  const query = keyword ? encodeURIComponent(keyword) : '';
  const page = Math.floor(Math.random() * 10) + 1; // generate a random page number between 1 and 10
  const url = `${pexelsEndpointUrl}/search?query=${query}&per_page=1&page=${page}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: pexelsAccessKey
      }
    });
    const data = await response.json();
    if (data && data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

function addChatBubble(text, isUser, isImage) {
    const chatBubble = document.createElement('div');
    chatBubble.classList.add('chat-bubble');
    chatBubble.classList.add(isUser ? 'user' : 'bot');
    chatContainer.appendChild(chatBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    if (isImage) {
      const image = document.createElement('img');
      image.src = text;
      chatBubble.appendChild(image);
    } else {
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
      }, 0.5);
    }
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

  const summary = extract.split('.').slice(0, 10).join('.') + '.';

  return summary;
}
