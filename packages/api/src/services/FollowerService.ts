import { IFollower, Follower } from "@brimble/models";

class FollowerService {
  public async followUser(id: string): Promise<IFollower> {
    try {
      return await Follower.create({
        user_id: id,
      });
    } catch (error) {
      const { message } = error as Error;
      throw {
        message,
        statusCode: 500,
      };
    }
  }

  public async unfollowUser(id: string) {
    return await Follower.findByIdAndDelete(id);
  }

  public async fetchFollowers(id: string) {
    //
  }
}

export default new FollowerService();
