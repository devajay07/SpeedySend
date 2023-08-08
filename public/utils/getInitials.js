function getInitials(fullName) {
  const firstLetter = fullName.charAt(0).toUpperCase();
  const lastLetterIndex = fullName.lastIndexOf(
    fullName
      .match(/[A-Z][a-z]+/g)
      .pop()
      .charAt(0)
  );
  const lastLetter = fullName.charAt(lastLetterIndex).toUpperCase();

  return firstLetter + lastLetter;
}
