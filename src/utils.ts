import { Match } from '@the-orange-alliance/api/lib/models';
import MatchType from '@the-orange-alliance/api/lib/models/types/MatchType';

export const matchSorter = (a: Match, b: Match) => {
    const tournamentLevel1 = a.tournamentLevel;
    const tournamentLevel2 = b.tournamentLevel;
    const matchNumber1 = parseInt(a.matchKey.split('-')[3].substring(1, 4));
    const matchNumber2 = parseInt(b.matchKey.split('-')[3].substring(1, 4));

    if (tournamentLevel1 === tournamentLevel2) {
      return matchNumber1 < matchNumber2 ? -1 : 1;
    } else if (tournamentLevel1 === MatchType.Finals) {
      return 1;
    } else if (tournamentLevel2 === MatchType.Finals) {
      return -1;
    } else {
      return tournamentLevel1 < tournamentLevel2 ? -1 : 1;
    }
  }
