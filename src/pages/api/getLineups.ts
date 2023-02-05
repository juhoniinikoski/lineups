const baseUrlSalibandy = 'https://api.salibandy.fi/lineup/all/';
const baseUrlFliiga = 'https://api.fliiga.fi/lineup/all/';
import _ from 'lodash';

type Team = {
  teamId: number;
  providerId: number;
  name: string;
  officialName: string;
  createdTime: Date;
  modifiedTime: Date;
};

type Player = {
  playerId: number;
  firstName: string;
  lastName: string;
  handed: string;
  position: string;
  captain: boolean;
};

type Lineup = {
  line: string;
  players: Player[];
};

type Lineups = {
  team: string;
  lineups: Lineup[];
};

type Result = {
  teamId: number;
  line: number;
  position: string;
  number: number;
  captain: number;
  assCaptain: number;
  rookie: number;
  gameId: number;
  playerId: number;
  player: {
    playerId: number;
    providerId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    placeOfBirth: string;
    countryOfBirth: string;
    nationality: string;
    height: number;
    weight: number;
    handed: string;
    position: string;
    lastTeamId: number;
    lastTeamDate: Date;
    createdTime: Date;
    modifiedTime: Date;
  };

  team: Team;
};

const parseLineups = (results: Result[]): Lineups[] => {
  const grouped = _.chain(results)
    .groupBy(r => r.team.name)
    .map((players, team) => ({ team, players }))
    .value();

  const players = grouped.map(g =>
    _.chain(g.players)
      .groupBy(r => r.line)
      .map((players, line) => ({
        line,
        players: players.map(
          p =>
            ({
              playerId: p.playerId,
              firstName: p.player.firstName,
              lastName: p.player.lastName,
              handed: p.player.handed,
              position: p.position,
              captain: p.captain === 1,
            } as Player),
        ),
      }))
      .value(),
  );

  const lineups = grouped.map((g, i) => {
    return {
      team: g.team,
      lineups: players[i],
    };
  });

  return lineups;
};

const getLineups = async (
  type: string,
  matchNro: string,
): Promise<Lineups[]> => {
  let result: Response;

  if (type === 'fliiga') {
    result = await fetch(`${baseUrlFliiga}${matchNro}`);
  } else {
    result = await fetch(`${baseUrlSalibandy}${matchNro}`);
  }

  const body = await result.json();

  const lineups = parseLineups(body.lineup);

  return lineups;
};

export default getLineups;
