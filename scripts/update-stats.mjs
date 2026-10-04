import { writeFile } from 'node:fs/promises'

const username = 'iarleyandrade'
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'iarley-profile-readme' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const response = await fetch(`https://api.github.com/users/${username}`, { headers })
if (!response.ok) throw new Error(`GitHub API respondeu ${response.status}`)
const profile = await response.json()
const repos = Number(profile.public_repos)
const followers = Number(profile.followers)
const since = new Date(profile.created_at).getUTCFullYear()
if (![repos, followers, since].every(Number.isFinite)) throw new Error('Dados públicos inválidos')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="180" viewBox="0 0 1000 180" role="img" aria-labelledby="title desc">
  <title id="title">GitHub em números</title><desc id="desc">${repos} repositórios públicos, ${followers} seguidores, no GitHub desde ${since}.</desc>
  <rect width="1000" height="180" rx="15" fill="#101b24" stroke="#36524c"/>
  <path d="M333 40v100M666 40v100" stroke="#36524c"/>
  <circle cx="52" cy="48" r="5" fill="#c9f37b"/>
  <text x="69" y="53" font-family="monospace" font-size="13" fill="#a5c8b9" letter-spacing="2">ATIVIDADE PÚBLICA</text>
  <text x="50" y="116" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#c9f37b">${String(repos).padStart(2, '0')}</text>
  <text x="50" y="147" font-family="Arial,sans-serif" font-size="15" fill="#c0d0c9">repositórios públicos</text>
  <text x="383" y="116" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#f1f4f0">${followers}</text>
  <text x="383" y="147" font-family="Arial,sans-serif" font-size="15" fill="#c0d0c9">pessoas acompanhando</text>
  <text x="716" y="116" font-family="Arial,sans-serif" font-size="56" font-weight="700" fill="#76c5c7">${since}</text>
  <text x="716" y="147" font-family="Arial,sans-serif" font-size="15" fill="#c0d0c9">no GitHub desde</text>
</svg>
`

await writeFile(new URL('../assets/stats.svg', import.meta.url), svg)
console.log(`Estatísticas públicas atualizadas: ${repos} repositórios, ${followers} seguidores, desde ${since}.`)
