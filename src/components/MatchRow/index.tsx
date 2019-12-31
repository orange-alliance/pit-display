import React from 'react';
import { Match } from '@the-orange-alliance/api/lib/models';
import StationStatus from '@the-orange-alliance/api/lib/models/types/StationStatus';
import './index.css';

interface IProps {
  match: Match
}

const MatchRow: React.FC<IProps> = ({ match }) => {
  const isPlayed = match.redScore > -1 || match.blueScore > -1;
  const winner = match.redScore > match.blueScore ? 'R' : match.blueScore > match.redScore ? 'B' : 'T';

  return (
    <div key={match.matchKey} className={'table-row ' + (isPlayed && 'win-' + winner.toLocaleLowerCase())}>
      <div className="col match">{match.matchName}</div>
      <div className="col score">
        { isPlayed ? <>
          <span className="red-score">{match.redScore}</span>
          &nbsp;-&nbsp;
          <span className="blue-score">{match.blueScore}</span>
        </> : <span/>}
      </div>
      {match.participants.map((p) =>
        <div key={p.matchParticipantKey}className={'col ' + (p.station > 20 ? 'blue' : 'red')}>
          {p.teamKey}{p.stationStatus === StationStatus.Surrogate && '*'}
        </div>
      )}
    </div>
  );
};

export default MatchRow;
