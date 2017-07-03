module.exports = {
  verboseLog (data) {
    if (typeof data === 'string') {
      data = [data]
    }
    console.log('==============================================================')
    for (let line of data) {
      console.log(`=  ${line}`)
    }
    console.log('==============================================================')
  }
}
