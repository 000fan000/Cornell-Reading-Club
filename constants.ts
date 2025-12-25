
import { Book } from './types';

// Flattened the object structure to match the Book interface exactly
export const DAO_DE_JING: Book = {
  id: "DDJ-001",
  title: "Dao De Jing",
  author: "Laozi",
  language: "Classical Chinese",
  publisher: "Ancient Philosophy Press",
  publication_year: "~400 BCE",
  version: "Wang Bi Commentary Version",
  chapters: [
    {
      "chapter_number": 1,
      "chapter_title": "Chapter 1",
      "original_text": "道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。故常无欲以观其妙；常有欲以观其徼。此两者同出而异名，同谓之玄，玄之又玄，众妙之门。",
      "translations": [
        /* Added missing language property to conform to Translation interface */
        {
          "translator": "Arthur Waley",
          "text": "The Way that can be told of is not an Unvarying Way; The names that can be named are not unvarying names. It was from the Nameless that Heaven and Earth sprang; The named is but the mother that rears the ten thousand creatures, each after its kind.",
          "language": "English"
        }
      ],
      "book_annotations": [
        {
          "type": "philosophical_interpretation",
          "content": "The opening lines introduce the ineffable nature of the Dao. 'Dao' here means both 'the way' and 'to speak', creating a paradox about describing the indescribable.",
          "reference_position": "lines_1-2"
        },
        {
          "type": "linguistic_note",
          "content": "常 (cháng) means both 'constant/eternal' and 'common/ordinary', creating wordplay about ordinary vs. eternal ways.",
          "reference_position": "line_1"
        },
        {
          "type": "historical_context",
          "content": "This chapter establishes the foundational Daoist concept of non-duality. The paired opposites (有名/无名, 有欲/无欲) are presented as complementary rather than contradictory.",
          "reference_position": "lines_3-6"
        },
        {
          "type": "key_concept",
          "content": "玄 (xuán) - profound mystery/dark enigma. This character appears twice for emphasis, suggesting layers of meaning beyond surface understanding.",
          "reference_position": "line_7"
        }
      ],
      "user_notes_template": {
        "cues": [
          "Non-duality",
          "Limits of language",
          "Mystery vs. manifestation"
        ],
        "notes": "The Dao cannot be fully captured in words or concepts. The named and unnamed, desire and desirelessness, arise from the same source.",
        "summary": "Introduction to the ineffable nature of ultimate reality."
      }
    },
    {
      "chapter_number": 2,
      "chapter_title": "Chapter 2",
      "original_text": "天下皆知美之为美，斯恶已；皆知善之为善，斯不善已。故有无相生，难易相成，长短相较，高下相倾，音声相和，前后相随。是以圣人处无为之事，行不言之教，万物作焉而不辞，生而不有，为而不恃，功成而弗居。夫唯弗居，是以不去。",
      "translations": [
        /* Added missing language property to conform to Translation interface */
        {
          "translator": "D.C. Lau",
          "text": "When everyone in the world knows beauty as beauty, ugliness arises; When everyone knows good as good, not-good arises. Thus being and non-being produce each other; Difficult and easy complete each other; Long and short contrast each other; High and low distinguish each other; Sound and voice harmonize each other; Front and back follow each other.",
          "language": "English"
        }
      ],
      "book_annotations": [
        {
          "type": "philosophical_interpretation",
          "content": "This chapter introduces the concept of relative opposites. Beauty only exists in contrast to ugliness; good only in contrast to bad.",
          "reference_position": "lines_1-2"
        },
        {
          "type": "practical_application",
          "content": "The sage practices 'non-action' (无为) - not forcing outcomes but allowing natural processes. This doesn't mean inactivity but acting in accordance with the Dao.",
          "reference_position": "lines_8-10"
        },
        {
          "type": "linguistic_note",
          "content": "和 (hè) means 'to harmonize' or 'respond to'. Here it describes how sound and echo create harmony through their relationship.",
          "reference_position": "line_7"
        },
        {
          "type": "key_concept",
          "content": "无为之事 - Affairs of non-action. The ideal ruler/governing principle that doesn't interfere with natural order.",
          "reference_position": "line_8"
        }
      ],
      "user_notes_template": {
        "cues": [
          "Relative values",
          "Wu wei (non-action)",
          "Complementary opposites"
        ],
        "notes": "Concepts exist in pairs; one cannot exist without its opposite. The sage recognizes this interdependence and acts without forcing outcomes.",
        "summary": "All values are relative; wisdom lies in non-forcing action and detachment from outcomes."
      }
    }
  ],
  "metadata": {
    "total_chapters": 81,
    "annotation_count": 247,
    "last_updated": "2023-10-15",
    "license": "Public Domain"
  }
};