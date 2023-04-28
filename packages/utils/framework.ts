import { frameworks } from "./index";

const detectFramework = (packageJson: any) => {
  const detectFramework = frameworks.find(
    (rx: { detector: string | RegExp | null }) => {
      if (rx.detector) {
        const regex = new RegExp(rx.detector, "gm");
        return regex.test(JSON.stringify(packageJson));
      }
    }
  );
  if (detectFramework) {
    return detectFramework;
  }
  return {
    name: "Other",
    slug: "other",
    logo: "https://res.cloudinary.com/dgqfojhx4/image/upload/v1674505025/logo_otzvi6.png",
    description: "No framework detected.",
    settings: {
      installCommand: "yarn --production=false",
      startCommand: null,
      buildCommand: "yarn build",
      outputDirectory: "public",
    },
  };
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
