import { type Plugin } from 'vite'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'


const projectRoot = dirname(fileURLToPath(import.meta.url))
const blogDirectory = join(projectRoot, 'public', 'blog')
const blogManifestPath = join(blogDirectory, 'index.json')

export function blogManifestPlugin(): Plugin {
  async function generateManifest() {
    const entries = await readdir(blogDirectory, { withFileTypes: true })
    const markdownFiles = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => entry.name)
      .sort((left, right) => left.localeCompare(right))
    const nextManifest = `${JSON.stringify(markdownFiles, null, 2)}\n`

    try {
      const currentManifest = await readFile(blogManifestPath, 'utf8')

      if (currentManifest === nextManifest) {
        return
      }
    } catch {
      // Write the manifest if it does not exist yet or cannot be read.
    }

    await writeFile(blogManifestPath, nextManifest, 'utf8')
  }

  return {
    name: 'blog-manifest-generator',
    async buildStart() {
      await generateManifest()
    },
    configureServer(server) {
      const refreshManifest = async () => {
        try {
          await generateManifest()
        } catch (error) {
          server.config.logger.error(`Failed to generate blog manifest: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      server.watcher.on('add', filePath => {
        if (filePath.startsWith(blogDirectory) && filePath.endsWith('.md')) {
          void refreshManifest()
        }
      })

      server.watcher.on('unlink', filePath => {
        if (filePath.startsWith(blogDirectory) && filePath.endsWith('.md')) {
          void refreshManifest()
        }
      })

      server.watcher.on('change', filePath => {
        if (filePath.startsWith(blogDirectory) && filePath.endsWith('.md')) {
          void refreshManifest()
        }
      })

      void refreshManifest()
    },
  }
}
