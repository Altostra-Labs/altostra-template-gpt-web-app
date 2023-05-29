import { getStatus, install, prompt } from './server.js';

let overlay
let loader

let connectDialog
let apiKeyField
let connectButton

let messageField
let sendMessageButton

const INSUFFICIENT_QUOTA_ERROR_MESSAGE = `
  You exceeded your current openai quota. Please review your plan and billing details by visiting: 
  <a href="https://platform.openai.com/account/usage" target="_blank">
    https://platform.openai.com/account/usage
  </a>.
  <br/>
  To replace your API key, please follow these steps to delete the existing one:
  <a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/deleting-parameters.html" target="_blank">
    https://docs.aws.amazon.com/systems-manager/latest/userguide/deleting-parameters.html
  </a>.
`

export async function loadAll() {
  overlay = document.querySelector(".overlay");
  overlay.style.display = "flex";
  loader = document.querySelector(".loader");

  const status = await getStatus()

  if(status.isInstalled) {
    overlay.style.display = "none";
  } else {
    loader.style.display = "none"
    connectDialog = document.querySelector(".connect-dialog")
    connectDialog.style.display = "block";

    apiKeyField = document.querySelector('.apiKey-field');
    connectButton = document.querySelector('.connect-btn');
    connectButton.addEventListener("click", connect);
  }

  messageField = document.querySelector('.message-field');
  sendMessageButton = document.querySelector('.send-message-btn');
  sendMessageButton.addEventListener('click', sendMessage);
}

async function connect(event) {
  event.preventDefault();
  if (!apiKeyField.value) {
    return;
  }

  loader.style.display = "flex"
  connectDialog.style.display = "none";

  await install(apiKeyField.value)
  overlay.style.display = "none";
}

async function sendMessage(event) {
  event.preventDefault();
  addMessage(messageField.value, 'sender')
  const messageText = messageField.value;
  messageField.value = '';
  sendMessageButton.disabled = true;
  let newMessage = ''

  try {
    const response = await prompt(messageText)
    newMessage = response.text
  } catch (err) {
    if(err.type === 'insufficient_quota') {
      newMessage = INSUFFICIENT_QUOTA_ERROR_MESSAGE
    }
    else { 
      console.error('Failed to prompt', err)
    }
  }

  if(newMessage) {
    addMessage(newMessage, 'response')
  }
}

function addMessage(text, className) {
  if (!text) {
    return;
  }

  const message = document.createElement('div');
  message.classList.add('message', className);
  message.innerHTML = `<p>${text}</p>`;
  document.querySelector('.chat').appendChild(message);
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

export function onInput(field) {
  if(field === 'apiKey') {
    connectButton.disabled = !apiKeyField.value.length
  }
  if(field === 'message') {
    sendMessageButton.disabled = !messageField.value.length
  }
}
