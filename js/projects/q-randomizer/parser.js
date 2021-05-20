const IMAGE_IDENTIFICATION_REGEX = /^(?<front>[ABC])(?<module>\d{2})-(?<qKind>[APE])(?<qNum>\d{2})-(?:(?<qSimpleAnswer>[A-E])|\((?<qComplexAnswer>[^\)]+)\))$/;
const SCAPEABLE_COMMA_SPLITTER_REGEX = /(?<!\\),/;

function parseImgName(str) {
  // Example name:
  // C03-P05-B             :: [simple  qAnswer]
  // B01-A10-(2\,5m, 5s)   :: [complex qAnswer]

  const match = str.match(IMAGE_IDENTIFICATION_REGEX);
  if (!match) {
    throw new Error('Invalid image identification name.');
  }

  const { qSimpleAnswer, qComplexAnswer, ...base } = match.groups;

  const qAnswer = {
    kind: qSimpleAnswer ? 'simple' : 'complex',
    answer: qSimpleAnswer
      ? qSimpleAnswer
      : qComplexAnswer
          .split(SCAPEABLE_COMMA_SPLITTER_REGEX)
          .map((str) => str.replaceAll('\\,', ','))
  };

  return { ...base, qAnswer };
}
