import React from 'react';
import { Ranking } from '@the-orange-alliance/api/lib/models';

interface IProps {
  ranking: Ranking
}

const RankingRow: React.FC<IProps> = ({ ranking }) => {
  return (
    <div key={ranking.rankKey} className="table-row">
      <div className="col rank">{ranking.rank}</div>
      <div className="col team">#{ranking.team.teamNumber} {ranking.team.teamNameShort ? ' - ' + ranking.team.teamNameShort : ''}</div>
      <div className="col wlt">{ranking.wins}-{ranking.losses}-{ranking.ties}</div>
      <div className="col rp">{ranking.rankingPoints.toFixed(1)}</div>
      <div className="col tbp">{ranking.tieBreakerPoints.toFixed(1)}</div>
      <div className="col played">{ranking.played}</div>
    </div>
  );
};

export default RankingRow;
