import React from 'react';
import { API } from '@the-orange-alliance/api/lib';
import { Event, Ranking, Match } from '@the-orange-alliance/api/lib/models';
import RankingRow from './components/RankingRow';
import MatchRow from './components/MatchRow';

const TOAProvider = new API(
  '246ac89aafc34a6042c26eab04cfe99f3a1bbc73da3b04813d2ccf62fbfe9203',
  'Pit Display'
);
const speed = 30;
const animation = (l: any[]) => ({
  animation: l.length * 48 / speed + 's linear 0s infinite normal none running marquee'
});

interface IProps {
  eventKey: string
}

interface IState {
  event: Event | null,
  rankings: Ranking[],
  matches: Match[],
  loading: boolean
}

class PitDisplay extends React.Component<IProps, IState> {
  private _timerID: any;

  constructor(props: IProps) {
    super(props);
    this._timerID = null;
    this.state = {
      event: null,
      rankings: [],
      matches: [],
      loading: true
    };
  }

  public componentDidMount() {
    TOAProvider.getEvent(this.props.eventKey).then((event: Event) => {
      const fetchData = () => this.fetchData(event);
      setInterval(fetchData, 30 * 1000);
      return fetchData();
    }).catch((error: any) => {
      console.error(error);
      this.setState({ loading: false });
    });
  }

  public fetchData(event: Event) {
    return TOAProvider.getEventRankings(event.eventKey).then((rankings: Ranking[]) => {
      return TOAProvider.getEventMatches(event.eventKey).then((matches: Match[]) => {
        if (rankings.length > 0 && matches.length > 0) {
          this.setState({ loading: false, event, rankings, matches });
        } else {
          this.setState({ loading: false, event });
        }
      });
    });
  }

  public render() {
    const { loading, event, rankings, matches } = this.state;
    if (loading) return <span/>;
    const rankingsView = rankings.map((ranking: Ranking) => <RankingRow key={ranking.rankKey} ranking={ranking} />);
    const matchesView = matches.map((match: Match) => <MatchRow key={match.matchKey} match={match} />);
    return <main className="container">
      { event ? <>
        <div style={{ padding: '40px 0' }}>
          <h1 className="title">{event.fullEventName}</h1>
          <h2 className="subtitle">Real-time results are available at <b>The Orange Alliance</b>!</h2>
          <h4 className="subtitle2">https://ftc.events/{event.eventKey}</h4>
        </div>
        <div className="row">
          { rankings.length > 0 && matches.length > 0 ? <>
            <div className="card" style={{ marginRight: 20 }}>
              <div className="table-row table-header">
                <div className="col rank">Rank</div>
                <div className="col team">Team</div>
                <div className="col wlt">W-L-T</div>
                <div className="col rp">RP</div>
                <div className="col tbp">TBP</div>
                <div className="col played">Played</div>
              </div>
              <div className="marquee">
                <div className="scroll" style={animation(rankings)} children={rankingsView} />
                <div className="scroll second-scroll" style={animation(rankings)} children={rankingsView} />
              </div>
            </div>
            <div className="card" style={{marginLeft: 20}}>
              <div className="table-row table-header">
                <div className="col match">Match</div>
                <div className="col score">Score</div>
                <div className="col red">Red Alliance</div>
                <div className="col blue">Blue Alliance</div>
              </div>
              <div className="marquee">
                <div className="scroll" style={animation(matches)} children={matchesView} />
                <div className="scroll second-scroll" style={animation(matches)} children={matchesView} />
              </div>
            </div>
          </> : <div className="error-message">
            <h1>No data available yet</h1>
            <h3>Hold tight, the matches haven't begun yet</h3>
          </div>}
        </div>
      </> : <div className="error-message">
        <h1>Oh Noes!1!!</h1>
        <h3>We couldn't find the event</h3>
      </div> }
    </main>;
  }
}

export default PitDisplay;