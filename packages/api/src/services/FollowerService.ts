import { IFollower, Follower } from "@brimble/models";

class FollowerService {

    public async followUser(id: string): Promise<IFollower>
    {
        return await Follower.create({
            user_id: id,
        });
    }

    public async unfollowUser(id: string) {
        return await Follower.findByIdAndDelete(id);
    }

    public async fetchFollowers(id: string) {
        //
    }
}

export default new FollowerService();