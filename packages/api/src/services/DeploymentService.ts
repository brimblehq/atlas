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
        const error = {
          statusCode: 404,
          message: `Repository with this name "${query}" not found`,
        };
        throw error;
      }

      return (data = data.flat(1));
    } catch (error) {
      if (error.code == "ENOTFOUND") {
        throw {
          message: "Couldn't make connection to GitHub at the moment.",
          statusCode: 500,
        };
      }
      throw {
        message: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  async retrieveRepo(ghrepo: any): Promise<any> {
    try {
      const data = await ghrepo.infoAsync();
      return data[0];
    } catch (error) {
      if (error.code == "ENOTFOUND") {
        throw {
          message: "Couldn't make connection to GitHub at the moment.",
          statusCode: 500,
        };
      }
      throw {
        message: error.message,
        statusCode: error.statusCode,
      };
    }
  }

  async repoBranches(ghrepo: any): Promise<any> {
    try {
      const data = await ghrepo.branchesAsync();
      return data[0];
    } catch (error) {
      if (error.code == "ENOTFOUND") {
        throw {
          message: "Couldn't make connection to GitHub at the moment.",
          statusCode: 500,
        };
      }
      throw {
        message: error.message,
        statusCode: error.statusCode,
      };
    }
  }
}
export default new DeploymentService();
