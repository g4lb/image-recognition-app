import { Schema, Document, model } from 'mongoose';

export interface ImageMetadata extends Document {
  key: string;
  recognizedObjects: string[];
}

export const ImageMetadataSchema = new Schema<ImageMetadata>({
  key: { type: String, required: true },
  recognizedObjects: [{ type: String }],
});

export const ImageMetadataModel = model<ImageMetadata>(
  'ImageMetadata',
  ImageMetadataSchema,
);
