import { useSearchParams } from "react-router";
import {
  TRACK_VERSION_LATEST,
  TRACK_VERSIONS,
  type TrackVersionId,
} from "@/shared/config/tracks";

export function parseDocVersion(value: string | null): TrackVersionId {
  return TRACK_VERSIONS.some((item) => item.id === value)
    ? (value as TrackVersionId)
    : TRACK_VERSION_LATEST;
}

export function useDocVersion() {
  const [params] = useSearchParams();
  return parseDocVersion(params.get("v"));
}
