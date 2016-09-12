import api from './api';

export const fetchActiveUsers = (slug, options) =>
  api.get(`/groups/${slug.toLowerCase()}/users?filter=active`, options)

export const fetchGroup = (slug) =>
   api.get(`/groups/${slug.toLowerCase()}/`)

export const fetchLeaderboard = () =>
  api.get('/leaderboard')

export const verifyGithubAccount = (token) =>
  api.get( '/connected-accounts/github/verify', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
