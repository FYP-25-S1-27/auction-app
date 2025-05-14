export default function compareAndConcatIds(
  userUuid1: string,
  userUuid2: string
) {
  if (userUuid1 < userUuid2) {
    return userUuid1 + userUuid2;
  } else {
    return userUuid2 + userUuid1;
  }
}
