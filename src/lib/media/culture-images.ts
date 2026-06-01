/**
 * LurkFeed Football — Real-scene culture photo library (30 images)
 *
 * Self-hosted JPEGs in /public/culture/photos/ — stadiums, pitches, players,
 * fans, jerseys, celebrations. Used when article cover/body images are missing
 * or fail to load.
 *
 * Source: Unsplash (free license). Re-download: npm run culture:fetch
 * Attribution: public/culture/PHOTOS.md
 */

export type CultureAspect = "card" | "hero" | "inline";

export interface CultureImage {
  id: string;
  /** Path served from /public (e.g. /culture/photos/01-stadium-soccer-match.jpg) */
  file: string;
  alt: string;
  theme:
    | "stadium"
    | "pitch"
    | "player"
    | "fans"
    | "jersey"
    | "ball"
    | "celebration";
}

/** 30 unique real-scene football photos — no duplicates, no abstract art. */
export const CULTURE_IMAGES: CultureImage[] = [
  { id: "01-stadium-soccer-match", file: "/culture/photos/01-stadium-soccer-match.jpg", alt: "Stadium full of fans watching a soccer match", theme: "stadium" },
  { id: "02-stadium-crowd-wide", file: "/culture/photos/02-stadium-crowd-wide.jpg", alt: "Wide shot of football fans in a packed stadium", theme: "fans" },
  { id: "03-stadium-seats-fans", file: "/culture/photos/03-stadium-seats-fans.jpg", alt: "Fans sitting in stadium seats before kickoff", theme: "fans" },
  { id: "04-fan-holding-jersey", file: "/culture/photos/04-fan-holding-jersey.jpg", alt: "Fan holding a green and white striped football shirt", theme: "jersey" },
  { id: "05-stadium-night-lights", file: "/culture/photos/05-stadium-night-lights.jpg", alt: "Football stadium under floodlights at night", theme: "stadium" },
  { id: "06-pitch-wide-green", file: "/culture/photos/06-pitch-wide-green.jpg", alt: "Green football pitch in a large stadium", theme: "pitch" },
  { id: "07-stadium-football-match", file: "/culture/photos/07-stadium-football-match.jpg", alt: "Stadium crowd watching a football match", theme: "stadium" },
  { id: "08-soccer-field-lines", file: "/culture/photos/08-soccer-field-lines.jpg", alt: "Soccer field with white lines and goals", theme: "pitch" },
  { id: "09-fans-watch-daytime", file: "/culture/photos/09-fans-watch-daytime.jpg", alt: "Fans watching a soccer game inside the stadium by day", theme: "fans" },
  { id: "10-player-on-pitch", file: "/culture/photos/10-player-on-pitch.jpg", alt: "Soccer player standing on the pitch in kit", theme: "player" },
  { id: "11-stadium-filled-stands", file: "/culture/photos/11-stadium-filled-stands.jpg", alt: "Football stadium filled with supporters", theme: "stadium" },
  { id: "12-soccer-field-empty", file: "/culture/photos/12-soccer-field-empty.jpg", alt: "Empty soccer field ready for match day", theme: "pitch" },
  { id: "13-fans-pitchside-phones", file: "/culture/photos/13-fans-pitchside-phones.jpg", alt: "Fans near the pitch capturing the match on phones", theme: "fans" },
  { id: "14-stadium-big-crowd", file: "/culture/photos/14-stadium-big-crowd.jpg", alt: "Large crowd in stadium during a football game", theme: "stadium" },
  { id: "15-crowd-stands-cheer", file: "/culture/photos/15-crowd-stands-cheer.jpg", alt: "Supporters cheering from the stands", theme: "fans" },
  { id: "16-soccer-field-sunset", file: "/culture/photos/16-soccer-field-sunset.jpg", alt: "Soccer field at golden hour", theme: "pitch" },
  { id: "17-ball-on-grass", file: "/culture/photos/17-ball-on-grass.jpg", alt: "Soccer ball on lush green grass", theme: "ball" },
  { id: "18-stadium-aerial", file: "/culture/photos/18-stadium-aerial.jpg", alt: "Aerial view of a football stadium", theme: "stadium" },
  { id: "19-street-soccer-players", file: "/culture/photos/19-street-soccer-players.jpg", alt: "Players competing on a soccer field", theme: "player" },
  { id: "20-pitch-floodlights-aerial", file: "/culture/photos/20-pitch-floodlights-aerial.jpg", alt: "Bird's-eye view of a lit soccer pitch", theme: "stadium" },
  { id: "21-fans-watch-stadium", file: "/culture/photos/21-fans-watch-stadium.jpg", alt: "Supporters watching football from the stands", theme: "fans" },
  { id: "22-soccer-crowd-match", file: "/culture/photos/22-soccer-crowd-match.jpg", alt: "Crowd watching a soccer game in the stadium", theme: "fans" },
  { id: "23-arena-supporters", file: "/culture/photos/23-arena-supporters.jpg", alt: "Fans packed into a soccer arena", theme: "stadium" },
  { id: "24-stadium-daytime-exterior", file: "/culture/photos/24-stadium-daytime-exterior.jpg", alt: "Soccer stadium exterior on match day", theme: "stadium" },
  { id: "25-pitch-line-closeup", file: "/culture/photos/25-pitch-line-closeup.jpg", alt: "Close-up of white line on a soccer pitch", theme: "pitch" },
  { id: "26-green-field-inside-stadium", file: "/culture/photos/26-green-field-inside-stadium.jpg", alt: "Green soccer field inside a large stadium", theme: "pitch" },
  { id: "27-soccer-ball-close", file: "/culture/photos/27-soccer-ball-close.jpg", alt: "Classic black and white soccer ball", theme: "ball" },
  { id: "28-football-stadium-day", file: "/culture/photos/28-football-stadium-day.jpg", alt: "Football stadium on a bright match afternoon", theme: "stadium" },
  { id: "29-crowd-football-game", file: "/culture/photos/29-crowd-football-game.jpg", alt: "Crowd watching a football game inside the stadium", theme: "fans" },
  { id: "30-fans-waving-flags", file: "/culture/photos/30-fans-waving-flags.jpg", alt: "Football fans waving flags in the stands", theme: "celebration" },
];

/** @deprecated aspect kept for API compat; local JPEGs use CSS object-cover per slot. */
export function cultureImageUrl(entry: CultureImage, _aspect?: CultureAspect): string {
  return entry.file;
}
