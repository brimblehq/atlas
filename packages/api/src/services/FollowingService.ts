// import { isValidObjectId } from "@/helpers";
import { IFollowing, Following, User, IUser } from "@brimble/models";
import user from "@brimble/models/user";

class FollowingService {
  public async followUser(user_id: string, followed_id: string) {
    try {
      const following = await Following.create({
        user_id,
        followed_id, 
      });
      return await User.findByIdAndUpdate(
        user_id,
        { $push: { following: following._id } }
      );
    } catch (error) {
      const { message } = error as Error;
      console.log(message);
      throw {
        message,
        statusCode: 500,
      };
    }
  }

  public async unfollowUser(user_id: string, id: string) {
    const data = await Following.find({ followed_id: id });
    await User.updateOne(
      {
        _id: user_id
      },
      { $pull: { 
        "following": data[0]._id
      } 
    });
    return await Following.deleteOne({
      followed_id: id,
      user_id
    });
  }

  public async fetchFollowing(user_id: string) {
    try {
      return await Following.find({ user_id: user_id });
    } catch (error) {
      const { message } = error as Error;
      throw {
        message,
        statusCode: 500,
      };
    }
  }

  public async fetchfollowers(user_id: string): Promise<IUser[]>{
    try {
      let data: any[] = [];
      const users = await Following.find({ followed_id: user_id });
      for(let i = 0; i < users.length; i++){
        data.push(users[i]);
      }
      return data;
    //fetch profile, push new details to array => array<object>
    } catch (error) {
      console.log(error);
      const { message } = error as Error;
      throw {
        message,
        statusCode: 500,
      };
    }
  }
}

export default new FollowingService();
