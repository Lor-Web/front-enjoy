export const TRACK_ID = "react" as const;

export const TRACK_TITLE = "React";

export const TRACK_SOURCE_URL = "https://react.dev/learn";

export const TRACK_VERSIONS = [{ id: "19", label: "19" }] as const;

export const TRACK_VERSION_LATEST = TRACK_VERSIONS[0].id;

export type TrackVersionId = (typeof TRACK_VERSIONS)[number]["id"];
