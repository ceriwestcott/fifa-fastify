import { Schema, Document, model, Model } from "mongoose";

export interface MatchAttributes {
  home: {
    name: string;
    team: string;
  };
  away: {
    name: string;
    team: string;
  };
}

export interface UpdateMatchAttributes {
  id: string;
  home: {
    goals: number;
  };
  away: {
    goals: number;
  };
}

export interface MatchSearchParams {
  id: string;
}

export interface MatchModel extends Model<MatchDocument> {
  addOne(match: MatchAttributes): MatchDocument;
}

export interface MatchDocument extends Document {
  homeTeam: {
    name: string;
    goals: number;
  };
  awayTeam: {
    name: string;
    goals: number;
  };
  inPlay: boolean;
  createdAt: Date;
}

export const matchSchema = new Schema({
  home: {
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    goals: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  away: {
    name: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    goals: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  inPlay: {
    type: Boolean,
    required: true,
    default: true,
  },
});

matchSchema.statics.addOne = function (match: MatchAttributes) {
  return new Match(match).save();
};

export const Match = model<MatchDocument, MatchModel>("Match", matchSchema);
