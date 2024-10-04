import { adjectives, animals, colors, uniqueNamesGenerator, Config } from 'unique-names-generator';

export const randomName = (config?: Config) : string => uniqueNamesGenerator(config || {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 1,
});