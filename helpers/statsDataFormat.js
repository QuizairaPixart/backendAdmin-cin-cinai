const statsDataFormat = (available, total) => {
  const parseAvailable = parseFloat(available)
  const parseTotal = parseFloat(total)
  const multiplication = parseAvailable * 100
  const percentage = Math.round(multiplication / parseTotal)
  // console.log(percentage)

  return percentage
}
module.exports = { statsDataFormat }
