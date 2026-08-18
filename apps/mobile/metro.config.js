// Metro config adaptée au monorepo pnpm : surveiller la racine et résoudre les
// packages @miabega/* depuis les node_modules de la racine du workspace.
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// 1. Surveiller tout le monorepo (packages partagés)
config.watchFolders = [workspaceRoot]

// 2. Résoudre les modules depuis le projet puis la racine
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// 3. Éviter les remontées de hiérarchie ambiguës
config.resolver.disableHierarchicalLookup = true

module.exports = config
