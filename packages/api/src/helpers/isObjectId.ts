import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const isValidObjectId = (id: string) => {
  if (ObjectId.isValid(id)) {
    return true;
  }
  return false;
};

export default isValidObjectId;
