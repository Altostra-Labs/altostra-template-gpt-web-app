import { baseUrl as apiUrl } from './api.js';

// In order to append path using the URL constructor - the "baseURL" must end with a '/'
const normalized = apiUrl.endsWith('/')
  ? apiUrl
  : apiUrl + '/'

const baseUrl = new URL(normalized);

export async function getStatus() {
  try {
    const response = await fetch(new URL('status', baseUrl));

    await throwIfError(response)
    return await response.json()
  } catch (err) {
    console.error('Failed to get status', err)
  }
}

export async function install(apiKey) {
  try {
    const response = await fetch(new URL('install', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey }),
    });

    await throwIfError(response)
  } catch (err) {
    console.error('Failed to install', err)
  }
}

export async function prompt(message) {
  try {
    const response = await fetch(new URL('prompt', baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: message }),
    });

    await throwIfError(response)
    return await response.json()
  } catch (err) {
    console.error('Failed to prompt', err)

    throw err
  }
}

async function throwIfError(response) {
  if (!response.ok) {
    const responseData = await response.json()

    throw Object.assign(new Error(response.statusText), {
      ...responseData.error,
      status: response.status,
      statusText: response.statusText,
    })
  }
}