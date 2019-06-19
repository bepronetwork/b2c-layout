export default function handleError(error) {
  console.error(error); //eslint-disable-line
  throw error.response;
}
