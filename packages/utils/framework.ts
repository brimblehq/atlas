import { default as frameworks } from "./constants/frameworks.json";

const dockerObject = {
  name: "Docker",
  slug: "docker",
  logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1728899289/brimble-assets/aedzr3gaxh3x8cdm1cxn.svg",
  description: "A Docker-based project.",
  settings: null,
  envPrefix: "",
  type: "docker"
};

const detectFramework = (packageJson: any, isDocker = false) => {
  if (isDocker) return dockerObject;

  const detectFramework = frameworks.find(
    (rx: { detector: string | RegExp | null }) => {
      if (rx.detector) {
        const regex = new RegExp(rx.detector, "gm");
        return regex.test(JSON.stringify(packageJson));
      }
    }
  );

  if (detectFramework) return detectFramework;

  return frameworks.find((framework) => framework.slug === "nodejs");
};

const allFrameworks = frameworks.map((framework: any) => {
  return {
    name: framework.name,
    slug: framework.slug,
    logo: framework.logo,
    description: framework.description,
    settings: {
      installCommand: framework.settings.installCommand,
      startCommand: framework.settings.startCommand,
      buildCommand: framework.settings.buildCommand,
      outputDirectory: framework.settings.outputDirectory,
    },
    envPrefix: framework.envPrefix,
    type: framework.type,
  };
});

allFrameworks.push(dockerObject as any);

export { detectFramework, allFrameworks };