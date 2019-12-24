import React from 'react';
import { Match } from '@the-orange-alliance/api/lib/models';
import StationStatus from '@the-orange-alliance/api/lib/models/types/StationStatus';
import './index.css';

interface IProps {
  match: Match
}

const MatchRow: React.FC<IProps> = ({ match }) => {
  return (
    <div key={match.matchKey} className={'table-row win-' + getWinner(match).toLocaleLowerCase()}>
      <div className="col match">{match.matchName}</div>
      <div className="col score">
        <span className="red-score">{match.redScore}</span>
        &nbsp;-&nbsp;
        <span className="blue-score">{match.blueScore}</span>
      </div>
      {match.participants.map((p) =>
        <div key={p.matchParticipantKey}className={'col ' + (p.station > 20 ? 'blue' : 'red')}>
          {p.teamKey}{p.stationStatus === StationStatus.Surrogate && '*'}
        </div>
      )}
    </div>
  );
};

const getWinner = (match: Match) => match.redScore > match.blueScore ? 'R' : match.blueScore > match.redScore ? 'B' : 'T';

export default MatchRow;
