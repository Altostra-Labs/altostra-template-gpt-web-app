import { getStatus, install, prompt } from './server.js';

let overlay
let loader

let connectDialog
let apiKeyField
let connectButton

let messageField
let sendMessageButton

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

  await install()
  overlay.style.display = "none";
}

async function sendMessage(event) {
  event.preventDefault();
  addMessage(messageField.value)
  messageField.value = '';
  sendMessageButton.disabled = true;

  const response = await prompt()
  addMessage(response.text)
}

function addMessage(text) {
  if (!text) {
    return;
  }

  const message = document.createElement('div');
  message.classList.add('message');
  message.innerHTML = `<p>${text}</p>`;
  document.querySelector('.chat').appendChild(message);
}

export function onKeyUp(field) {
  if(field === 'apiKey') {
    connectButton.disabled = !apiKeyField.value.length
  }
  if(field === 'message') {
    sendMessageButton.disabled = !messageField.value.length
  }
}
