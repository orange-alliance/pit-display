import React from 'react';
import QRCode from 'qrcode';
import { API } from '@the-orange-alliance/api/lib';
import { Event, Ranking, Match } from '@the-orange-alliance/api/lib/models';
import { matchSorter } from './utils';
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
  qrcode: string,
  rankings: Ranking[],
  matches: Match[],
  loading: boolean
  rankingsScroll: boolean,
  matchesScroll: boolean
}

class PitDisplay extends React.Component<IProps, IState> {
  private _timerID: any;

  constructor(props: IProps) {
    super(props);
    this._timerID = null;
    this.state = {
      event: null,
      qrcode: '',
      rankings: [],
      matches: [],
      loading: true,
      rankingsScroll: false,
      matchesScroll: false
    };
  }

  public componentDidMount() {
    TOAProvider.getEvent(this.props.eventKey).then((event: Event) => {
      return QRCode.toDataURL('https://toa.events/' + event.eventKey, { errorCorrectionLevel: 'H' }, (err: Error, url: string) => {
        console.log(url);
        const fetchData = () => this.fetchData(event, url);
        setInterval(fetchData, 30 * 1000);
        return fetchData();
      });
    }).catch((error: any) => {
      console.error(error);
      this.setState({ loading: false });
    });
    window.onresize = () => this.setState({}); // Check cards height [componentDidUpdate]
  }

  public fetchData(event: Event, qrcode: string) {
    return TOAProvider.getEventRankings(event.eventKey).then((rankings: Ranking[]) => {
      return TOAProvider.getEventMatches(event.eventKey).then((matches: Match[]) => {
        matches.sort(matchSorter);
        if (rankings.length > 0 && matches.length > 0) {
          this.setState({ loading: false, event, qrcode, rankings, matches });
        } else {
          this.setState({ loading: false, event, qrcode });
        }
      });
    });
  }

  componentDidUpdate() {
    const newState: any = {};
    const cardHeight = document.querySelector('.card')?.clientHeight || 0;
    const contextHeight = cardHeight - 56; // Minus header
    const bottomPadding = 40;

    const rankingsShouldScroll = (document.querySelector('#rankings-scroll')?.clientHeight || 0) - bottomPadding > contextHeight;
    const matchesShouldScroll = (document.querySelector('#matches-scroll')?.clientHeight || 0) - bottomPadding > contextHeight;

    // Control of endless loop of state update
    if (this.state.rankingsScroll !== rankingsShouldScroll) newState.rankingsScroll = rankingsShouldScroll;
    if (this.state.matchesScroll !== matchesShouldScroll) newState.matchesScroll = matchesShouldScroll;
    if (Object.keys(newState).length > 0) this.setState(newState);
  }

  public render() {
    const { loading, event, qrcode, rankings, matches, rankingsScroll, matchesScroll } = this.state;
    if (loading) return <span/>;
    const rankingsView = rankings.map((ranking: Ranking) => <RankingRow key={ranking.rankKey} ranking={ranking} />);
    const matchesView = matches.map((match: Match) => <MatchRow key={match.matchKey} match={match} />);
    
    return <main className="container">
      { event ? <>
        <div style={{ padding: '40px 0', display: 'flex' }}>
          <img src={qrcode} className="qrcode" />
          <div style={{ margin: '0 25px' }}>
            <h1 className="title">{event.fullEventName}</h1>
            <h2 className="subtitle">Real-time results are available at <b>The Orange Alliance</b>!</h2>
            <h4 className="subtitle2">https://toa.events/{event.eventKey}</h4>
          </div>
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
                <div className="scroll" id="rankings-scroll" style={rankingsScroll ? animation(rankings) : {}} children={rankingsView} />
                <div className="scroll second-scroll" style={rankingsScroll ? animation(rankings) : { display: 'none' }} children={rankingsView} />
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
                <div className="scroll" id="matches-scroll" style={matchesScroll ? animation(matches) : {}} children={matchesView} />
                <div className="scroll second-scroll" style={matchesScroll ? animation(matches) : { display: 'none' }} children={matchesView} />
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