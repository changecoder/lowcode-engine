export function splitLabelByKeywords(label: string, keywords: string): string[] {
  const len = keywords.length;
  const fragments = [];
  let str = label;

  while (str.length > 0) {
    const index = str.indexOf(keywords);

    if (index === 0) {
      fragments.push(keywords);
      str = str.slice(len);
    } else if (index < 0) {
      fragments.push(str);
      str = '';
    } else {
      fragments.push(str.slice(0, index));
      str = str.slice(index);
    }
  }

  return fragments;
}
