class DeploymentService {
  async allRepos(ghme: any, limit: number, query?: string): Promise<any> {
    try {
      let data = await ghme.reposAsync({ page: 1, per_page: limit });
      if (query) {
        data = data[0]?.filter((repo: any) => {
          return query
            .toLowerCase()
            .split(" ")
            .every((v: string) => repo.name.toLowerCase().includes(v));
        });
      }

      if (data.length == 0) {
        return false;
      }

      return (data = data.flat(1));
    } catch (error) {
      throw new Error("Couldn't make connection to GitHub at the moment.");
    }
  }
}
export default new DeploymentService();
