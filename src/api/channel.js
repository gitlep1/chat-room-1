import apiUrl from '../apiConfig'
import axios from 'axios'

export const createChannel = (channel, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/channelCreator',
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: { channel }
  })
}

export const channelIndex = user => {
  return axios({
    method: 'GET',
    url: apiUrl + '/channelCreator',
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

export const channelDelete = (user, channelId) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/channelCreator/' + channelId,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

export const channelUpdate = (user, channel, id) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/channelCreator/' + id,
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    data: { channel: channel }
  })
}

export const showChannels = (user, channelId) => {
  return axios({
    method: 'GET',
    url: apiUrl + '/channelCreator/' + channelId,
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}
