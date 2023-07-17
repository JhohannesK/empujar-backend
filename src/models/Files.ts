import { Schema, model, Document } from 'mongoose';

interface IFile extends Document {
  title: string;
  description: string;
}

const fileSchema = new Schema<IFile>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const File = model<IFile>('File', fileSchema);

export default File;
