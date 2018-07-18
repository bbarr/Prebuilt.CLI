
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const R = require('ramda')
const exec = promisify(require('child_process').exec)

const recursive = require("recursive-readdir")

const readFile = path => new Promise(res => fs.readFile(path, 'utf8', (e, d) => res(d)))
const writeFile = async (filePath, content) => {
  const file = filePath.split(path.sep).pop()
  const dir = path.dirname(filePath)
  await exec(`mkdir -p ${dir}`)
  return new Promise(res => {
    fs.writeFile(filePath, content, (e, d) => {
      res(d)
    })
  })
}
const readdir = promisify(fs.readdir.bind(fs))
const stat = promisify(fs.stat.bind(fs))

const core = require('prebuilt-core')

class LazyData extends core.Drop {

  constructor(cursor='') {
    super()
    this.cursor = cursor
  }

  async beforeMethod(method) {

    if (!this.cursor) {
      return new LazyData('data').get(method)
    }

    this.cursor = path.join(this.cursor, method)
    const dir = `${this.path}/${this.cursor}`
    try {
      if ((await stat(dir)).isDirectory()) {
        return new LazyData(this.cursor)
      }
    } catch(e) {}

    try {
      if ((await stat(dir + '.json')).isFile()) {
        return JSON.parse(await readFile(dir + '.json'))
      }
    } catch(e) {}

    return '[missing]'
  }

}

const createFile = async (filePath) => {
  const raw = await readFile(filePath)
  return {
    raw,
    path: path.dirname(filePath),
    file: filePath.split(path.sep + 'input' + path.sep).pop()
  }
}

module.exports = async (projectPath) => {

  LazyData.prototype.path = projectPath 
  const data = new LazyData

  // clear output for now
  await exec(`rm -rf ${projectPath}/output/*`)

  const allFilePaths = await recursive(`${projectPath}/input`)
  const filePaths = core.project.onlyRenderable(allFilePaths)

  const outputChains = await Promise.all(
    filePaths.map(async (filePath) => {
      const file = await createFile(filePath)
      const built = await core.build(file, { data }, {
        async readFile(filePath) {
          const completePath = path.join(projectPath, filePath)
          return createFile(filePath)
        }
      })
      return built.map(b => b.concat(file))
    })
  )

  await Promise.all(
    R.unnest(outputChains).map(([ meta, content, file ]) => {
      const filePath = meta.output || (file.file.replace('.liquid', '.html'))
      return writeFile(`${projectPath}/output/${filePath}`, content)
    })
  )
}
