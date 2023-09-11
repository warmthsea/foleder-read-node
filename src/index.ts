import fs from 'node:fs'
import path from 'node:path'
import app from './main'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function countDirectories(directoryPath: string, callback: (e: Error | null, count?: number) => void) {
  let directoryCount = 0

  fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      callback(err)
      return
    }

    files.forEach((file) => {
      if (file.isDirectory())
        directoryCount++
    })

    callback(null, directoryCount)
  })
}

app.get('/page/count', (req, res) => {
  const directoryPath = 'src/folder'

  countDirectories(directoryPath, (err: Error, count: number) => {
    if (err) {
      console.error('Error counting directories:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
    else {
      res.json(count)
    }
  })
})

app.get('/count/:page', async (req, res) => {
  fs.readdir('src/folder', { withFileTypes: true }, (_err, files1) => {
    const directoryPath = `src/folder/${files1[+(req.params.page) - 1].name}`

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      }
      else {
        const fileCount = files.length
        const fileList = files.map(file => ({
          name: file,
          url: `/count/detail/${files1[+(req.params.page) - 1].name}/${encodeURIComponent(file)}`,
        }))

        res.json({
          count: fileCount,
          fileList,
        })
      }
    })
  })
})

app.get('/count/detail/:page/:path', (req, res) => {
  console.log(req.params.page)
  console.log(req.params.path)

  // 发送图像文件
  res.sendFile(path.join(__dirname, 'folder', `${req.params.page}/${req.params.path}`))
})
