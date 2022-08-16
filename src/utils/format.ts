export const formatDateString = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export const elipses = (str: string, length: number) => {
  if (str && str.length > length) {
    return str.substring(0, length) + "...";
  }
  return str;
}