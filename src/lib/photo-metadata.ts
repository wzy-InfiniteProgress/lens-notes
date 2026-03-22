export type ExtractedPhotoMetadata = {
  shotAt: string;
  camera: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
};

const EMPTY_VALUE = "参数无";

function formatAperture(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `f/${value}`;
  }

  if (typeof value === "string" && value.trim()) {
    return value.startsWith("f/") ? value : `f/${value}`;
  }

  return EMPTY_VALUE;
}

function formatShutter(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    if (value >= 1) {
      return `${value}s`;
    }

    return `1/${Math.round(1 / value)}s`;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return EMPTY_VALUE;
}

function formatIso(value: number | string | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.round(value));
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return EMPTY_VALUE;
}

function formatShotAt(value: Date | string | undefined) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 16);
  }

  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 16);
    }
  }

  return "";
}

export async function extractPhotoMetadata(file: File): Promise<ExtractedPhotoMetadata> {
  try {
    const exifr = await import("exifr");
    const output = await exifr.parse(file, [
      "DateTimeOriginal",
      "CreateDate",
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
    ]);

    return {
      shotAt: formatShotAt(output?.DateTimeOriginal ?? output?.CreateDate),
      camera:
        String(output?.Model ?? output?.LensModel ?? "").trim() || EMPTY_VALUE,
      aperture: formatAperture(output?.FNumber),
      shutterSpeed: formatShutter(output?.ExposureTime),
      iso: formatIso(output?.ISO),
    };
  } catch {
    return {
      shotAt: "",
      camera: EMPTY_VALUE,
      aperture: EMPTY_VALUE,
      shutterSpeed: EMPTY_VALUE,
      iso: EMPTY_VALUE,
    };
  }
}
