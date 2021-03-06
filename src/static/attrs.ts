/**
 * Check if a character is a whitespace character according
 * to the XML spec (space, carriage return, line feed or tab)
 *
 * @param {string} character Character to check
 * @return {boolean} Whether the character is whitespace or not
 */
export const isWhitespace = (character: string): boolean => character === ' ' || character === '\r' || character === '\n' || character === '\t';

/**
 * Parse a string of XML attributes to a map of attribute names
 * to their values
 *
 * @memberof Saxophone
 * @param {string} input A string of XML attributes
 * @throws {Error} If the string is malformed
 * @return {Object} A map of attribute names to their values
 */
export const parseAttrs = (input: string): object => {
  const attrs: any = {};
  const end = input.length;
  let position = 0;

  while (position < end) {
    // skip all whitespace
    if (isWhitespace(input[position])) {
      position += 1;
      continue;
    }

    // check that the attribute name contains valid chars
    const startName = position;

    while (input[position] !== '=' && position < end) {
      if (isWhitespace(input[position])) {
        throw Error('Attribute names may not contain whitespace');
      }

      position += 1;
    }

    // this is XML so we need a value for the attribute
    if (position === end) {
      throw Error('Expected a value for the attribute');
    }

    const attrName = input.slice(startName, position);
    position += 1;
    const startQuote = input[position];
    position += 1;

    if (startQuote !== '"' && startQuote !== "'") {
      throw Error('Attribute values should be quoted');
    }

    const endQuote = input.indexOf(startQuote, position);

    if (endQuote === -1) {
      throw Error('Unclosed attribute value');
    }

    const attrValue = input.slice(position, endQuote);

    attrs[attrName] = attrValue;
    position = endQuote + 1;
  }

  return attrs;
};
