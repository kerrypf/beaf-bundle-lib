import glob from "fast-glob"
export const excludeFiles = (files = []) => {
  const excludes = ['node_modules']
  return files.filter(
    (path) => !excludes.some(exclude => path.includes(exclude))
  )
}

export const getFileList = () => glob.sync('**/*.*', {
  cwd: 'src'
})

export const getFileListPath = (basePath, dirPath) => {
  let inputFiles = {};
  let fileArr = fs.readdirSync(dirPath);
  if (fileArr && fileArr.length) {
      for (let i = 0; i < fileArr.length; i++) {
          const fileName = fileArr[i];
          const filePath = dirPath + '/' + fileName
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
              const childFiles = getFileList(basePath, filePath);
              if (childFiles) {
                  inputFiles = Object.assign(inputFiles, childFiles);
              }
          } else {
              const extname = path.extname(filePath);
              if (extensions.includes(extname) && !excludes.includes(fileName)) {
                  let inputName = filePath.substring(basePath.length, filePath.length - extname.length);
                  if (inputName.startsWith('/')) {
                      inputName = inputName.substring(1);
                  }
                  console.info(inputName)
                  inputFiles[inputName] = filePath;
              }
          }
      }
  }
  return inputFiles;
}