import { default as frameworks } from "./constants/frameworks.json";

const detectFramework = (packageJson: any) => {
  const detectFramework = frameworks.find(
    (rx: { detector: string | RegExp | null }) => {
      if (rx.detector) {
        const regex = new RegExp(rx.detector, "gm");
        return regex.test(JSON.stringify(packageJson));
      }
    }
  );

  if (detectFramework) return detectFramework;

  return frameworks.find((framework) => framework.slug === "other");
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

export { detectFramework, allFrameworks };
