const getPosition = async (input) => {
  const valueOne = parseFloat(input[0][2])
  const valueTwo = parseFloat(input[0][3])

  console.log(valueOne)
  console.log(valueTwo)
  const posLeft = Math.floor((valueTwo * 100) / (valueOne + valueTwo));
  console.log(posLeft)
  return posLeft
}
export default getPosition;
